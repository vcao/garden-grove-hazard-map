<script setup lang="ts">
const windFromDeg = defineModel<number>('windFromDeg', { required: true })
const windSpeedMph = defineModel<number>('windSpeedMph', { required: true })

const props = withDefaults(defineProps<{
  disabled?: boolean
}>(), { disabled: false })

const svgRef = ref<SVGSVGElement | null>(null)
const dragging = ref(false)

const SIZE = 140
const CENTER = SIZE / 2
const RADIUS = 56

// Arrow tip position — arrow points FROM the upwind direction TOWARD the plume.
// Meteorological 0° = N (up). We draw the arrow pointing toward (windFromDeg + 180) % 360.
const travelDeg = computed(() => (windFromDeg.value + 180) % 360)

function polarToXY(deg: number, r: number) {
  // 0° = up (north), increasing clockwise
  const rad = ((deg - 90) * Math.PI) / 180
  return { x: CENTER + r * Math.cos(rad), y: CENTER + r * Math.sin(rad) }
}

const arrowHead = computed(() => polarToXY(travelDeg.value, RADIUS))
const arrowTail = computed(() => polarToXY(windFromDeg.value, RADIUS * 0.55))

function angleFromCenter(clientX: number, clientY: number) {
  if (!svgRef.value) return 0
  const rect = svgRef.value.getBoundingClientRect()
  const x = clientX - rect.left - CENTER * (rect.width / SIZE)
  const y = clientY - rect.top - CENTER * (rect.height / SIZE)
  // Convert to compass degrees (0° = up, clockwise)
  let deg = (Math.atan2(y, x) * 180) / Math.PI + 90
  if (deg < 0) deg += 360
  return Math.round(deg)
}

function setFromTravelPoint(clientX: number, clientY: number) {
  const travel = angleFromCenter(clientX, clientY)
  windFromDeg.value = (travel + 180) % 360
}

function onPointerDown(e: PointerEvent) {
  if (props.disabled) return
  dragging.value = true
  ;(e.target as Element).setPointerCapture?.(e.pointerId)
  setFromTravelPoint(e.clientX, e.clientY)
}

function onPointerMove(e: PointerEvent) {
  if (props.disabled) return
  if (!dragging.value) return
  setFromTravelPoint(e.clientX, e.clientY)
}

function onPointerUp(e: PointerEvent) {
  dragging.value = false
  ;(e.target as Element).releasePointerCapture?.(e.pointerId)
}

const cardinals = [
  { label: 'N', deg: 0 },
  { label: 'E', deg: 90 },
  { label: 'S', deg: 180 },
  { label: 'W', deg: 270 }
]

function compassLabel(deg: number) {
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
  const idx = Math.round(deg / 22.5) % 16
  return dirs[idx]
}
</script>

<template>
  <div class="space-y-3">
    <div>
      <div class="text-sm font-medium mb-1">Wind direction</div>
      <div class="flex items-start gap-3">
        <svg
          ref="svgRef"
          :viewBox="`0 0 ${SIZE} ${SIZE}`"
          class="wind-svg select-none"
          :class="{ disabled: props.disabled }"
          @pointerdown="onPointerDown"
          @pointermove="onPointerMove"
          @pointerup="onPointerUp"
          @pointercancel="onPointerUp"
        >
          <!-- outer ring -->
          <circle :cx="CENTER" :cy="CENTER" :r="RADIUS + 6" fill="rgba(0,0,0,0.04)" />
          <circle :cx="CENTER" :cy="CENTER" :r="RADIUS" fill="white" stroke="#cbd5e1" stroke-width="1" />

          <!-- cardinal ticks -->
          <g v-for="c in cardinals" :key="c.label">
            <text
              :x="polarToXY(c.deg, RADIUS - 12).x"
              :y="polarToXY(c.deg, RADIUS - 12).y"
              text-anchor="middle"
              dominant-baseline="middle"
              font-size="11"
              font-weight="600"
              fill="#475569"
            >{{ c.label }}</text>
          </g>

          <!-- arrow -->
          <line
            :x1="arrowTail.x"
            :y1="arrowTail.y"
            :x2="arrowHead.x"
            :y2="arrowHead.y"
            stroke="#22c55e"
            stroke-width="4"
            stroke-linecap="round"
          />
          <!-- head -->
          <circle :cx="arrowHead.x" :cy="arrowHead.y" r="6" fill="#16a34a" />
          <!-- center dot -->
          <circle :cx="CENTER" :cy="CENTER" r="3" fill="#475569" />
        </svg>

        <div class="text-xs space-y-1">
          <div><span class="text-gray-500">From:</span> <span class="font-mono">{{ windFromDeg }}° ({{ compassLabel(windFromDeg) }})</span></div>
          <div><span class="text-gray-500">Plume travels:</span> <span class="font-mono">{{ compassLabel(travelDeg) }}</span></div>
        </div>
      </div>
    </div>

    <div :class="{ 'opacity-60': props.disabled }">
      <label class="block text-sm font-medium mb-1">
        Wind speed: <span class="font-mono">{{ windSpeedMph }} mph</span>
      </label>
      <input
        v-model.number="windSpeedMph"
        type="range"
        :min="0"
        :max="40"
        :step="1"
        class="w-full"
        :disabled="props.disabled"
      >
    </div>
  </div>
</template>

<style scoped>
.wind-svg {
  width: 140px;
  height: 140px;
  touch-action: none;
  cursor: pointer;
}

.wind-svg.disabled {
  cursor: not-allowed;
  opacity: 0.7;
}
</style>
