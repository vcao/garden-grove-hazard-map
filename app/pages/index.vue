<script setup lang="ts">
import type { FeatureCollection } from 'geojson'
import evacZoneRaw from '~/assets/data/evac-zone.json'
import evacCentersRaw from '~/assets/data/evac-centers.json'
import {
  DEFAULT_GALLONS
} from '~/composables/useHazardConstants'
import { computeHazard } from '~/composables/useHazardModel'

const evacZone = evacZoneRaw as unknown as FeatureCollection
const evacCenters = evacCentersRaw as unknown as FeatureCollection

const gallons = ref(DEFAULT_GALLONS)
const { windFromDeg, windSpeedMph, displayMode } = useWind()
const real = useRealWind()

// In Real (now) mode, the compass & speed slider mirror the Open-Meteo values
// (and stay disabled). Switching back to Real always resnaps them.
watch(
  [displayMode, real.windFromDeg, real.windSpeedMph],
  () => {
    if (
      displayMode.value === 'real'
      && real.windFromDeg.value != null
      && real.windSpeedMph.value != null
    ) {
      windFromDeg.value = real.windFromDeg.value
      windSpeedMph.value = real.windSpeedMph.value
    }
  },
  { immediate: true }
)

const hazard = computed(() =>
  computeHazard({
    gallons: gallons.value,
    windFromDeg: windFromDeg.value,
    windSpeedMph: windSpeedMph.value
  })
)

const realUnavailable = computed(() => displayMode.value === 'real' && real.error.value != null)

useHead({
  title: 'Garden Grove Hazard Map'
})
</script>

<template>
  <div class="app-layout">
    <div class="map-area">
      <ClientOnly>
        <MapCanvas
          :evac-zone="evacZone"
          :plume="hazard.plume"
          :overpressure="hazard.overpressure"
          :shrapnel="hazard.shrapnel"
          :evac-centers="evacCenters"
        />
        <WindParticleOverlay
          :wind-from-deg="windFromDeg"
          :wind-speed-mph="windSpeedMph"
          :enabled="displayMode !== 'off'"
        />
        <MapLegend />
        <template #fallback>
          <div class="map-loading">Loading map…</div>
        </template>
      </ClientOnly>
    </div>
    <ClientOnly>
      <SidePanel
        v-model:gallons="gallons"
        v-model:wind-from-deg="windFromDeg"
        v-model:wind-speed-mph="windSpeedMph"
        v-model:display-mode="displayMode"
        :evac-centers="evacCenters"
        :real-wind-from-deg="real.windFromDeg.value"
        :real-wind-speed-mph="real.windSpeedMph.value"
        :real-fetched-at="real.fetchedAt.value"
        :real-loading="real.loading.value"
        :real-unavailable="realUnavailable"
      />
      <template #fallback>
        <aside class="side-panel-fallback" />
      </template>
    </ClientOnly>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: row;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

.map-area {
  position: relative;
  flex: 1;
  min-width: 0;
  height: 100%;
}

.map-loading {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  color: #94a3b8;
  font-size: 14px;
}

.side-panel-fallback {
  width: 380px;
  max-width: 100vw;
  height: 100%;
  background: white;
  border-left: 1px solid rgb(229 231 235);
}

@media (max-width: 1024px) {
  .app-layout {
    flex-direction: column;
  }
  .map-area {
    height: 50vh;
  }
}
</style>
