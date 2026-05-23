import type { FeatureCollection } from 'geojson'
import { circlePolygon, offsetMeters } from './useGeo'
import { LEAK_COORDS } from './useHazardConstants'

// === Methyl methacrylate physical constants =================================
const MMA_DENSITY_KG_PER_GAL = 3.56     // ~0.94 kg/L × 3.785 L/gal
const MMA_HEAT_COMBUSTION_MJ_KG = 26.0
const TNT_ENERGY_MJ_KG = 4.184
const VCE_YIELD = 0.03                  // 3% vapor cloud explosion yield (conservative)

// === Blast scaling ==========================================================
// Hopkinson-Cranz scaled distances (m / kg^(1/3)) for unconfined TNT
const Z_OVERPRESSURE_1PSI = 18          // ~1 psi overpressure (window/glass breakage threshold)
const SHRAPNEL_K = 30                   // empirical envelope coefficient

export interface HazardState {
  gallons: number
  windFromDeg: number     // wind direction (FROM), meteorological 0°=N, 90°=E
  windSpeedMph: number
}

export interface HazardOutput {
  overpressureRadiusM: number
  shrapnelRadiusM: number
  overpressure: FeatureCollection
  shrapnel: FeatureCollection
  plume: FeatureCollection
}

export function computeBlastRadii(gallons: number) {
  const massKg = gallons * MMA_DENSITY_KG_PER_GAL
  const tntKg = massKg * (MMA_HEAT_COMBUSTION_MJ_KG / TNT_ENERGY_MJ_KG) * VCE_YIELD
  const overpressureRadiusM = Z_OVERPRESSURE_1PSI * Math.cbrt(tntKg)
  const shrapnelRadiusM = SHRAPNEL_K * Math.cbrt(gallons)
  return { overpressureRadiusM, shrapnelRadiusM, tntKg }
}

/**
 * Build a stack of teardrop plume polygons of decreasing length so they read
 * as a dissipation gradient when rendered at low constant opacity (darker
 * near the source, lighter at the tip).
 *
 * Returns 5 polygons at 100%, 80%, 60%, 40%, 20% of the full length.
 * Each carries a `band` (1 = outermost/longest, 5 = innermost/shortest).
 */
const PLUME_BANDS = [1, 0.8, 0.6, 0.4, 0.2] as const

export function computePlume(windFromDeg: number, windSpeedMph: number): FeatureCollection {
  const travelDeg = (windFromDeg + 180) % 360
  // Length scales with wind speed; capped to keep readable on map.
  const baseLengthM = Math.min(8_000, Math.max(500, windSpeedMph * 350))
  const halfWidthRatio = 0.18  // ~Pasquill class D dispersion

  const features = PLUME_BANDS.map((scale, idx) => {
    const lengthM = baseLengthM * scale
    const samples = 28
    const right: [number, number][] = []
    const left: [number, number][] = []
    for (let i = 1; i <= samples; i++) {
      const t = i / samples
      const distance = t * lengthM
      const halfWidth = halfWidthRatio * distance
      const center = offsetMeters(LEAK_COORDS, distance, travelDeg)
      right.push(offsetMeters(center, halfWidth, travelDeg + 90))
      left.push(offsetMeters(center, halfWidth, travelDeg - 90))
    }
    const ring: [number, number][] = [
      LEAK_COORDS,
      ...right,
      ...left.reverse(),
      LEAK_COORDS
    ]
    return {
      type: 'Feature' as const,
      properties: { kind: 'plume', band: idx + 1, scale },
      geometry: { type: 'Polygon' as const, coordinates: [ring] }
    }
  })

  return { type: 'FeatureCollection', features }
}

export function computeHazard(state: HazardState): HazardOutput {
  const { overpressureRadiusM, shrapnelRadiusM } = computeBlastRadii(state.gallons)

  const overpressure: FeatureCollection = {
    type: 'FeatureCollection',
    features: [circlePolygon(LEAK_COORDS, overpressureRadiusM)]
  }
  const shrapnel: FeatureCollection = {
    type: 'FeatureCollection',
    features: [circlePolygon(LEAK_COORDS, shrapnelRadiusM)]
  }
  const plume = computePlume(state.windFromDeg, state.windSpeedMph)

  return {
    overpressureRadiusM,
    shrapnelRadiusM,
    overpressure,
    shrapnel,
    plume
  }
}

export function emptyFC(): FeatureCollection {
  return { type: 'FeatureCollection', features: [] }
}
