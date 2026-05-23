<script setup lang="ts">
import { MIN_GALLONS, MAX_GALLONS } from '~/composables/useHazardConstants'
import { computeBlastRadii } from '~/composables/useHazardModel'

const gallons = defineModel<number>('gallons', { required: true })

const radii = computed(() => computeBlastRadii(gallons.value))

function fmtMeters(m: number) {
  return m >= 1000 ? `${(m / 1000).toFixed(2)} km` : `${Math.round(m)} m`
}

function fmtFeet(m: number) {
  const ft = m * 3.28084
  return ft >= 5280 ? `${(ft / 5280).toFixed(2)} mi` : `${Math.round(ft)} ft`
}
</script>

<template>
  <div class="space-y-3">
    <div>
      <label class="block text-sm font-medium mb-1">
        Gas volume: <span class="font-mono">{{ gallons.toLocaleString() }} gal</span>
      </label>
      <input
        v-model.number="gallons"
        type="range"
        :min="MIN_GALLONS"
        :max="MAX_GALLONS"
        :step="500"
        class="w-full"
      >
      <div class="flex justify-between text-xs text-gray-500 mt-1">
        <span>{{ MIN_GALLONS.toLocaleString() }}</span>
        <span>{{ MAX_GALLONS.toLocaleString() }}</span>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-2 text-sm">
      <div class="rounded border border-red-300 bg-red-50 p-2 dark:bg-red-950/30">
        <div class="text-xs font-medium text-red-700 dark:text-red-300">Overpressure (1 psi)</div>
        <div class="font-mono">{{ fmtMeters(radii.overpressureRadiusM) }}</div>
        <div class="font-mono text-xs text-gray-500">{{ fmtFeet(radii.overpressureRadiusM) }}</div>
      </div>
      <div class="rounded border border-amber-300 bg-amber-50 p-2 dark:bg-amber-950/30">
        <div class="text-xs font-medium text-amber-700 dark:text-amber-300">Shrapnel envelope</div>
        <div class="font-mono">{{ fmtMeters(radii.shrapnelRadiusM) }}</div>
        <div class="font-mono text-xs text-gray-500">{{ fmtFeet(radii.shrapnelRadiusM) }}</div>
      </div>
    </div>

    <p class="text-xs text-gray-500 leading-relaxed">
      Simplified TNT-equivalent visualization (3% VCE yield, Hopkinson-Cranz scaling).
      Not a substitute for ALOHA / EPA RMP modeling.
    </p>
  </div>
</template>
