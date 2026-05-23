<script setup lang="ts">
import type { FeatureCollection } from 'geojson'
import type { WindDisplayMode } from '~/composables/useWind'

const gallons = defineModel<number>('gallons', { required: true })
const windFromDeg = defineModel<number>('windFromDeg', { required: true })
const windSpeedMph = defineModel<number>('windSpeedMph', { required: true })
const displayMode = defineModel<WindDisplayMode>('displayMode', { required: true })

defineProps<{
  evacCenters: FeatureCollection
  realWindFromDeg: number | null
  realWindSpeedMph: number | null
  realFetchedAt: number | null
  realLoading: boolean
  realUnavailable: boolean
}>()

type TabId = 'controls' | 'feed' | 'centers' | 'news' | 'mma'
const active = ref<TabId>('controls')
const termsOpen = ref(false)

interface TabDef {
  id: TabId
  label: string
  icon: string
}

const tabs: TabDef[] = [
  { id: 'controls', label: 'Controls', icon: 'i-lucide-sliders-horizontal' },
  { id: 'feed', label: 'OCFA', icon: 'i-lucide-megaphone' },
  { id: 'centers', label: 'Centers', icon: 'i-lucide-map-pin' },
  // { id: 'news', label: 'News', icon: 'i-lucide-newspaper' },
  { id: 'mma', label: 'MMA', icon: 'i-lucide-flask-conical' }
]
</script>

<template>
  <aside class="side-panel">
    <header class="px-4 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800">
      <h1 class="text-base font-semibold leading-tight">Garden Grove Hazard Map</h1>
      <p class="text-xs text-gray-500 mt-0.5">GKN Aerospace MMA incident</p>

      <div class="phone-pills">
        <a
          href="tel:+17147415444"
          class="phone-pill info"
          aria-label="Call Garden Grove information hotline"
        >
          <UIcon name="i-lucide-phone" class="size-3.5" />
          <span>Information hotline: <strong>714-741-5444</strong></span>
        </a>
        <a
          href="tel:911"
          class="phone-pill emergency"
          aria-label="Call 911 for emergencies"
        >
          <UIcon name="i-lucide-siren" class="size-3.5" />
          <span>For an actual emergency, call <strong>911</strong></span>
        </a>
      </div>
      <p class="emergency-note">For an actual emergency, call <a href="tel:911">911</a>.</p>

      <p class="disclaimer">
        <strong>Disclaimer:</strong> theoretical model for situational awareness only — not a substitute for ALOHA / EPA RMP or official guidance.
        <button
          type="button"
          class="terms-link"
          @click="termsOpen = true"
        >Terms</button>
      </p>
    </header>

    <TermsModal v-model:open="termsOpen" />

    <nav class="tab-bar">
      <button
        v-for="t in tabs"
        :key="t.id"
        type="button"
        class="tab-button"
        :class="{ active: active === t.id }"
        @click="active = t.id"
      >
        <UIcon :name="t.icon" class="size-4" />
        <span>{{ t.label }}</span>
      </button>
    </nav>

    <div class="overflow-y-auto px-4 py-4 flex-1">
      <ControlsPanel
        v-if="active === 'controls'"
        v-model:gallons="gallons"
        v-model:wind-from-deg="windFromDeg"
        v-model:wind-speed-mph="windSpeedMph"
        v-model:display-mode="displayMode"
        :real-wind-from-deg="realWindFromDeg"
        :real-wind-speed-mph="realWindSpeedMph"
        :real-fetched-at="realFetchedAt"
        :real-loading="realLoading"
        :real-unavailable="realUnavailable"
      />
      <OcfaFeedPanel v-else-if="active === 'feed'" />
      <EvacCentersPanel v-else-if="active === 'centers'" :centers="evacCenters" />
      <NewsPanel v-else-if="active === 'news'" />
      <MmaInfoPanel v-else-if="active === 'mma'" />
    </div>
  </aside>
</template>

<style scoped>
.side-panel {
  display: flex;
  flex-direction: column;
  width: 380px;
  max-width: 100vw;
  height: 100%;
  background: white;
  border-left: 1px solid rgb(229 231 235);
}

:global(.dark) .side-panel {
  border-left-color: rgb(31 41 55);
  background: rgb(17 24 39);
}

.tab-bar {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0;
  padding: 6px 6px 0;
  border-bottom: 1px solid rgb(229 231 235);
}

:global(.dark) .tab-bar {
  border-bottom-color: rgb(31 41 55);
}

.tab-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 8px 4px;
  font-size: 11px;
  font-weight: 500;
  color: rgb(107 114 128);
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
}

.tab-button:hover {
  color: rgb(55 65 81);
}

:global(.dark) .tab-button {
  color: rgb(156 163 175);
}

:global(.dark) .tab-button:hover {
  color: rgb(229 231 235);
}

.tab-button.active {
  color: rgb(34 197 94);
  border-bottom-color: rgb(34 197 94);
}

.phone-pills {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 8px;
}

.phone-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  border-radius: 6px;
  color: white;
  font-size: 12px;
  font-weight: 500;
  text-decoration: none;
  transition: background 0.15s;
}

.phone-pill.emergency {
  background: #dc2626;
}

.phone-pill.emergency:hover {
  background: #b91c1c;
}

.phone-pill.info {
  background: #2563eb;
}

.phone-pill.info:hover {
  background: #1d4ed8;
}

.emergency-note {
  margin-top: 6px;
  font-size: 10px;
  color: rgb(107 114 128);
}

.emergency-note a {
  color: #dc2626;
  font-weight: 600;
  text-decoration: underline;
}

.disclaimer {
  margin-top: 8px;
  font-size: 10px;
  line-height: 1.35;
  color: rgb(107 114 128);
}

.disclaimer strong {
  color: rgb(75 85 99);
}

.terms-link {
  display: inline;
  background: transparent;
  border: none;
  padding: 0;
  margin-left: 2px;
  font-size: 10px;
  color: rgb(59 130 246);
  text-decoration: underline;
  cursor: pointer;
}

.terms-link:hover {
  color: rgb(37 99 235);
}

@media (max-width: 1024px) {
  .side-panel {
    width: 100%;
    height: 50vh;
    border-left: none;
    border-top: 1px solid rgb(229 231 235);
  }
}
</style>
