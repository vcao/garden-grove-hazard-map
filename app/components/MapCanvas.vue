<script setup lang="ts">
import 'maplibre-gl/dist/maplibre-gl.css'
import type { FeatureCollection } from 'geojson'

const props = defineProps<{
  evacZone: FeatureCollection
  plume: FeatureCollection
  overpressure: FeatureCollection
  shrapnel: FeatureCollection
  evacCenters: FeatureCollection
}>()

const container = ref<HTMLDivElement | null>(null)
const { init, setSourceData, destroy } = useMap()

onMounted(() => {
  if (!container.value) return
  init(container.value, {
    evacZone: props.evacZone,
    plume: props.plume,
    overpressure: props.overpressure,
    shrapnel: props.shrapnel,
    evacCenters: props.evacCenters
  })
})

onBeforeUnmount(() => destroy())

watch(() => props.plume, (v) => setSourceData('plume', v), { deep: true })
watch(() => props.overpressure, (v) => setSourceData('overpressure', v), { deep: true })
watch(() => props.shrapnel, (v) => setSourceData('shrapnel', v), { deep: true })
watch(() => props.evacZone, (v) => setSourceData('evacZone', v), { deep: true })
watch(() => props.evacCenters, (v) => setSourceData('evacCenters', v), { deep: true })
</script>

<template>
  <div ref="container" class="map-canvas" />
</template>

<style>
.map-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.leak-marker {
  width: 18px;
  height: 18px;
  background: #ef4444;
  border: 3px solid #fff;
  border-radius: 50%;
  box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
  animation: leak-pulse 1.6s infinite;
  cursor: pointer;
}

@keyframes leak-pulse {
  0%   { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
  70%  { box-shadow: 0 0 0 16px rgba(239, 68, 68, 0); }
  100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
}

.maplibregl-popup-content {
  font-family: system-ui, -apple-system, sans-serif;
  font-size: 13px;
}

.evac-marker {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: default;
  pointer-events: auto;
  transform: translate(0, 0);
}

.evac-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #16a34a;
  border: 2px solid #ffffff;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.25);
  flex-shrink: 0;
}

.evac-label {
  display: inline-flex;
  flex-direction: column;
  font-family: system-ui, -apple-system, sans-serif;
  font-size: 11px;
  line-height: 1.15;
  background: rgba(255, 255, 255, 0.92);
  padding: 3px 6px;
  border-radius: 4px;
  white-space: nowrap;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  max-width: 220px;
}

.evac-label-name {
  font-weight: 600;
  color: #14532d;
}

.evac-label-type {
  font-size: 10px;
  color: #16a34a;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
</style>
