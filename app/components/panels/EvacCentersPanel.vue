<script setup lang="ts">
import type { FeatureCollection, Point } from 'geojson'

const props = defineProps<{
  centers: FeatureCollection
}>()

const { flyTo } = useMap()

interface CenterProps {
  name: string
  address?: string
  type?: string
  notes?: string
}

const centers = computed(() => {
  return props.centers.features
    .filter((f): f is GeoJSON.Feature<Point, CenterProps> => f.geometry.type === 'Point')
    .map(f => ({
      name: f.properties?.name ?? 'Unnamed',
      address: f.properties?.address,
      type: f.properties?.type,
      notes: f.properties?.notes,
      coords: f.geometry.coordinates as [number, number]
    }))
})

function go(coords: [number, number]) {
  flyTo(coords, 16)
}
</script>

<template>
  <div class="space-y-2">
    <p class="text-xs text-gray-500 mb-3">
      Click a center to fly the map to that location.
    </p>
    <ul class="space-y-2">
      <li
        v-for="c in centers"
        :key="c.name"
        class="rounded border border-gray-200 dark:border-gray-700 p-3 hover:bg-blue-50 dark:hover:bg-blue-950 cursor-pointer transition-colors"
        @click="go(c.coords)"
      >
        <div class="flex items-start justify-between gap-2">
          <div class="font-medium text-sm">{{ c.name }}</div>
          <UBadge v-if="c.type" :label="c.type" size="xs" variant="subtle" />
        </div>
        <div v-if="c.address" class="text-xs text-gray-500 mt-1">{{ c.address }}</div>
        <div v-if="c.notes" class="text-xs text-gray-600 dark:text-gray-400 mt-1">{{ c.notes }}</div>
      </li>
    </ul>
  </div>
</template>
