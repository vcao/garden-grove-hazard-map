<script setup lang="ts">
import { DEFAULT_GALLONS } from '~/composables/useHazardConstants'
import type { WindDisplayMode } from '~/composables/useWind'

const gallons = defineModel<number>('gallons', { required: true })
const windFromDeg = defineModel<number>('windFromDeg', { required: true })
const windSpeedMph = defineModel<number>('windSpeedMph', { required: true })
const displayMode = defineModel<WindDisplayMode>('displayMode', { required: true })

defineProps<{
  realWindFromDeg: number | null
  realWindSpeedMph: number | null
  realFetchedAt: number | null
  realLoading: boolean
  realUnavailable: boolean
}>()

const { reset: resetWind } = useWind()

function resetAll() {
  gallons.value = DEFAULT_GALLONS
  resetWind()
}

function compassLabel(deg: number) {
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
  return dirs[Math.round(deg / 22.5) % 16]
}
</script>

<template>
  <div class="space-y-6">
    <section>
      <h3 class="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3">Blast model</h3>
      <BlastSlider v-model:gallons="gallons" />
    </section>

    <section>
      <h3 class="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3">Wind &amp; Potential Plume</h3>

      <div class="mb-3">
        <div class="text-xs font-medium mb-1.5 text-gray-900">
          Animated wind on map
        </div>
        <div class="segmented">
          <button
            type="button"
            class="seg-btn"
            :class="{ active: displayMode === 'real' }"
            @click="displayMode = 'real'"
          >
            Real (now)
          </button>
          <button
            type="button"
            class="seg-btn"
            :class="{ active: displayMode === 'what-if' }"
            @click="displayMode = 'what-if'"
          >
            What-if
          </button>
          <button
            type="button"
            class="seg-btn"
            :class="{ active: displayMode === 'off' }"
            @click="displayMode = 'off'"
          >
            Off
          </button>
        </div>

        <div v-if="displayMode === 'real'" class="mt-2 text-[11px] leading-snug text-gray-500">
          <span v-if="realLoading">Fetching current wind…</span>
          <span v-else-if="realUnavailable">Live wind unavailable; particles fall back to compass setting.</span>
          <span v-else-if="realWindFromDeg != null && realWindSpeedMph != null">
            Particles show <strong>current weather</strong>:
            <span class="font-mono">{{ realWindFromDeg }}° {{ compassLabel(realWindFromDeg) }} @ {{ realWindSpeedMph }} mph</span>.
            Compass below drives the plume scenario.
          </span>
        </div>
        <div v-else-if="displayMode === 'what-if'" class="mt-2 text-[11px] leading-snug text-gray-500">
          Particles follow the compass below.
        </div>
        <div v-else class="mt-2 text-[11px] leading-snug text-gray-500">
          Animated wind layer hidden. Compass still drives the plume.
        </div>
      </div>

      <WindCompass
        v-model:windFromDeg="windFromDeg"
        v-model:windSpeedMph="windSpeedMph"
        :disabled="displayMode === 'real'"
      />
    </section>

    <UButton variant="soft" color="neutral" block @click="resetAll">
      Reset to defaults
    </UButton>
  </div>
</template>

<style scoped>
.segmented {
  display: inline-flex;
  border: 1px solid rgb(209 213 219);
  border-radius: 6px;
  overflow: hidden;
}

.seg-btn {
  padding: 5px 12px;
  font-size: 12px;
  font-weight: 500;
  color: rgb(107 114 128);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.seg-btn + .seg-btn {
  border-left: 1px solid rgb(209 213 219);
}

.seg-btn:hover:not(.active) {
  background: rgb(243 244 246);
}

.seg-btn.active {
  background: rgb(34 197 94);
  color: white;
}
</style>
