<script setup lang="ts">
const expanded = ref(true)
</script>

<template>
  <div class="legend" :class="{ collapsed: !expanded }">
    <button
      type="button"
      class="legend-toggle"
      :aria-expanded="expanded"
      @click="expanded = !expanded"
    >
      <UIcon name="i-lucide-list" class="size-3.5" />
      <span>Legend</span>
      <UIcon
        :name="expanded ? 'i-lucide-chevron-down' : 'i-lucide-chevron-up'"
        class="size-3 text-gray-400 ml-auto"
      />
    </button>

    <ul v-if="expanded" class="legend-list">
      <li>
        <span class="swatch leak-dot" aria-hidden="true" />
        <span>GKN Aerospace Leak</span>
      </li>
      <li>
        <span class="swatch center-dot" aria-hidden="true" />
        <span>Evacuation / Reunification Center</span>
      </li>
      <li>
        <span class="swatch overpressure-ring" aria-hidden="true" />
        <span>Overpressure (1 psi)</span>
      </li>
      <li>
        <span class="swatch shrapnel-ring" aria-hidden="true" />
        <span>Shrapnel envelope</span>
      </li>
      <li>
        <span class="swatch evac-zone" aria-hidden="true" />
        <span>Mandatory evacuation zone</span>
      </li>
      <li>
        <span class="swatch plume" aria-hidden="true" />
        <span>Potential Toxic Plume (downwind)</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.legend {
  position: absolute;
  bottom: 36px;
  left: 12px;
  z-index: 2;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgb(209 213 219);
  border-radius: 8px;
  padding: 6px 8px;
  font-size: 11px;
  line-height: 1.3;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(4px);
  max-width: 220px;
  user-select: none;
}

.legend.collapsed {
  padding: 6px 8px;
}

.legend-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  border: none;
  background: transparent;
  font-weight: 600;
  font-size: 11px;
  color: rgb(31 41 55);
  cursor: pointer;
  padding: 0;
}

.legend-list {
  list-style: none;
  margin: 6px 0 0;
  padding: 0;
  display: grid;
  gap: 4px;
}

.legend-list li {
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgb(55 65 81);
}

.swatch {
  display: inline-block;
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  border-radius: 3px;
}

.swatch.leak-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #ef4444;
  border: 2px solid white;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
}

.swatch.center-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #16a34a;
  border: 2px solid white;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
}

.swatch.overpressure-ring {
  background: rgba(239, 68, 68, 0.18);
  border: 2px solid #ef4444;
  border-radius: 50%;
}

.swatch.shrapnel-ring {
  background: transparent;
  border: 2px dashed #fbbf24;
  border-radius: 50%;
}

.swatch.evac-zone {
  background: rgba(255, 170, 0, 0.25);
  border: 2px solid #ffaa00;
}

.swatch.plume {
  background: rgba(34, 197, 94, 0.35);
}
</style>
