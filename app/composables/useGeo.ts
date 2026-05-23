import type { Feature, Polygon } from 'geojson'

const EARTH_RADIUS_M = 6_371_008.8

/**
 * Offset a [lon, lat] coordinate by `distanceMeters` along `bearingDeg`
 * (0 = north, 90 = east). Haversine direct formula.
 */
export function offsetMeters(
  origin: [number, number],
  distanceMeters: number,
  bearingDeg: number
): [number, number] {
  const [lon, lat] = origin
  const δ = distanceMeters / EARTH_RADIUS_M
  const θ = (bearingDeg * Math.PI) / 180
  const φ1 = (lat * Math.PI) / 180
  const λ1 = (lon * Math.PI) / 180

  const sinφ2 = Math.sin(φ1) * Math.cos(δ) + Math.cos(φ1) * Math.sin(δ) * Math.cos(θ)
  const φ2 = Math.asin(sinφ2)
  const y = Math.sin(θ) * Math.sin(δ) * Math.cos(φ1)
  const x = Math.cos(δ) - Math.sin(φ1) * sinφ2
  const λ2 = λ1 + Math.atan2(y, x)

  return [(λ2 * 180) / Math.PI, (φ2 * 180) / Math.PI]
}

/** Build a `vertices`-sided polygon of radius `radiusMeters` around `center`. */
export function circlePolygon(
  center: [number, number],
  radiusMeters: number,
  vertices = 64
): Feature<Polygon> {
  const coords: [number, number][] = []
  for (let i = 0; i < vertices; i++) {
    const bearing = (i / vertices) * 360
    coords.push(offsetMeters(center, radiusMeters, bearing))
  }
  coords.push(coords[0]!)
  return {
    type: 'Feature',
    properties: {},
    geometry: { type: 'Polygon', coordinates: [coords] }
  }
}
