import maplibregl, { type Map as MLMap } from 'maplibre-gl'
import type { Feature, FeatureCollection } from 'geojson'
import { LEAK_COORDS } from './useHazardConstants'

const ESRI_SATELLITE_TILES = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
const ESRI_LABELS_TILES = 'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}'

const ESRI_ATTRIBUTION = 'Tiles © Esri — World Imagery, World Boundaries and Places'

export type LayerSources = {
  evacZone: FeatureCollection
  plume: FeatureCollection
  overpressure: FeatureCollection
  shrapnel: FeatureCollection
  evacCenters: FeatureCollection
}

const _map = ref<MLMap | null>(null)
const _ready = ref(false)
const _centerMarkers: maplibregl.Marker[] = []

export function useMap() {
  function init(container: HTMLElement, initial: LayerSources) {
    if (_map.value) return _map.value

    const map = new maplibregl.Map({
      container,
      style: {
        version: 8,
        sources: {
          'esri-satellite': {
            type: 'raster',
            tiles: [ESRI_SATELLITE_TILES],
            tileSize: 256,
            attribution: ESRI_ATTRIBUTION,
            maxzoom: 19
          },
          'esri-labels': {
            type: 'raster',
            tiles: [ESRI_LABELS_TILES],
            tileSize: 256,
            maxzoom: 19
          }
        },
        layers: [
          { id: 'satellite', type: 'raster', source: 'esri-satellite' },
          { id: 'labels', type: 'raster', source: 'esri-labels', paint: { 'raster-opacity': 0.85 } }
        ]
      },
      center: LEAK_COORDS,
      zoom: 14,
      pitch: 0
    })

    map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-right')
    map.addControl(new maplibregl.ScaleControl({ unit: 'imperial' }), 'bottom-left')

    map.on('load', () => {
      // GeoJSON sources for dynamic overlays
      map.addSource('evac-zone', { type: 'geojson', data: initial.evacZone })
      map.addSource('plume', { type: 'geojson', data: initial.plume })
      map.addSource('overpressure', { type: 'geojson', data: initial.overpressure })
      map.addSource('shrapnel', { type: 'geojson', data: initial.shrapnel })
      map.addSource('evac-centers', { type: 'geojson', data: initial.evacCenters })

      map.addLayer({
        id: 'evac-zone-fill',
        type: 'fill',
        source: 'evac-zone',
        paint: { 'fill-color': '#ffaa00', 'fill-opacity': 0.15 }
      })
      map.addLayer({
        id: 'evac-zone-line',
        type: 'line',
        source: 'evac-zone',
        paint: { 'line-color': '#ffaa00', 'line-width': 3 }
      })

      map.addLayer({
        id: 'plume-fill',
        type: 'fill',
        source: 'plume',
        paint: {
          // Plume is rendered as 5 overlapping polygons of decreasing length.
          // Each individual polygon is rendered at low alpha; the stack reads
          // as a dissipation gradient (darkest near source, lightest at tip).
          'fill-color': '#22c55e',
          'fill-opacity': 0.16
        }
      })

      map.addLayer({
        id: 'shrapnel-line',
        type: 'line',
        source: 'shrapnel',
        paint: {
          'line-color': '#fbbf24',
          'line-width': 2,
          'line-dasharray': [2, 2]
        }
      })

      map.addLayer({
        id: 'overpressure-fill',
        type: 'fill',
        source: 'overpressure',
        paint: { 'fill-color': '#ef4444', 'fill-opacity': 0.18 }
      })
      map.addLayer({
        id: 'overpressure-line',
        type: 'line',
        source: 'overpressure',
        paint: { 'line-color': '#ef4444', 'line-width': 2 }
      })

      // Evac centers: HTML markers with a label so users can identify each dot
      // without clicking. Replaces the bare circle layer.
      for (const feature of initial.evacCenters.features) {
        if (feature.geometry.type !== 'Point') continue
        const [lng, lat] = feature.geometry.coordinates as [number, number]
        const name = (feature.properties?.name as string | undefined) ?? 'Center'
        const type = (feature.properties?.type as string | undefined) ?? ''

        const wrap = document.createElement('div')
        wrap.className = 'evac-marker'
        wrap.innerHTML = `
          <span class="evac-dot"></span>
          <span class="evac-label">
            <span class="evac-label-name">${name.replace(/</g, '&lt;')}</span>
            ${type ? `<span class="evac-label-type">${type.replace(/</g, '&lt;')}</span>` : ''}
          </span>
        `
        const marker = new maplibregl.Marker({ element: wrap, anchor: 'left' })
          .setLngLat([lng, lat])
          .addTo(map)
        _centerMarkers.push(marker)
      }

      // Leak source marker — pulsing red dot
      const el = document.createElement('div')
      el.className = 'leak-marker'
      new maplibregl.Marker({ element: el, anchor: 'center' })
        .setLngLat(LEAK_COORDS)
        .setPopup(new maplibregl.Popup({ offset: 12 }).setHTML(
          '<strong>GKN Aerospace</strong><br/>Leaking MMA tank'
        ))
        .addTo(map)

      _ready.value = true
    })

    _map.value = map
    return map
  }

  function setSourceData(id: keyof LayerSources, data: Feature | FeatureCollection) {
    const m = _map.value
    if (!m) return
    const sourceId = ({
      evacZone: 'evac-zone',
      plume: 'plume',
      overpressure: 'overpressure',
      shrapnel: 'shrapnel',
      evacCenters: 'evac-centers'
    } as const)[id]
    const src = m.getSource(sourceId) as maplibregl.GeoJSONSource | undefined
    if (src) src.setData(data as FeatureCollection)
  }

  function flyTo(lngLat: [number, number], zoom = 16) {
    _map.value?.flyTo({ center: lngLat, zoom, essential: true })
  }

  function destroy() {
    for (const m of _centerMarkers) m.remove()
    _centerMarkers.length = 0
    _map.value?.remove()
    _map.value = null
    _ready.value = false
  }

  return { init, setSourceData, flyTo, destroy, map: _map, ready: _ready }
}
