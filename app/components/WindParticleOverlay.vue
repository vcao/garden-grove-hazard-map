<script setup lang="ts">
interface Props {
  windFromDeg: number
  windSpeedMph: number
  enabled?: boolean
}

const props = withDefaults(defineProps<Props>(), { enabled: true })

const canvasRef = ref<HTMLCanvasElement | null>(null)

interface Particle {
  x: number
  y: number
  age: number
  maxAge: number
  jitter: number
}

const PARTICLE_COUNT = 143
const TRAIL_FADE_ALPHA = 0.08
const PX_PER_MPH_PER_FRAME = 0.45
const PARTICLE_FILL = 'rgba(255, 255, 255, 0.6)'

let particles: Particle[] = []
let rafId: number | null = null
let resizeObs: ResizeObserver | null = null

function seedParticles(width: number, height: number) {
  particles = []
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      age: Math.random() * 240,
      maxAge: 180 + Math.random() * 220,
      jitter: 0.85 + Math.random() * 0.3
    })
  }
}

function fitCanvas() {
  const canvas = canvasRef.value
  if (!canvas) return
  const parent = canvas.parentElement
  if (!parent) return
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const w = parent.clientWidth
  const h = parent.clientHeight
  canvas.width = Math.floor(w * dpr)
  canvas.height = Math.floor(h * dpr)
  canvas.style.width = `${w}px`
  canvas.style.height = `${h}px`
  const ctx = canvas.getContext('2d')!
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  if (particles.length === 0) {
    seedParticles(w, h)
  }
}

function tick() {
  const canvas = canvasRef.value
  if (!canvas) {
    rafId = null
    return
  }
  const ctx = canvas.getContext('2d')!
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const w = canvas.width / dpr
  const h = canvas.height / dpr

  // Wind travel direction (meteorological FROM → TO is +180°)
  const travelDeg = (props.windFromDeg + 180) % 360
  const rad = (travelDeg * Math.PI) / 180
  // Screen coords: x right, y down; 0° = up (north)
  const vx = Math.sin(rad)
  const vy = -Math.cos(rad)
  const speed = props.windSpeedMph * PX_PER_MPH_PER_FRAME

  // Fade trails — paint a transparent black over the canvas
  ctx.globalCompositeOperation = 'destination-in'
  ctx.fillStyle = `rgba(0, 0, 0, ${1 - TRAIL_FADE_ALPHA})`
  ctx.fillRect(0, 0, w, h)
  ctx.globalCompositeOperation = 'source-over'

  // Draw + advance particles
  ctx.fillStyle = PARTICLE_FILL
  for (const p of particles) {
    p.age++
    p.x += vx * speed * p.jitter
    p.y += vy * speed * p.jitter

    const offScreen = p.x < -10 || p.x > w + 10 || p.y < -10 || p.y > h + 10
    if (offScreen || p.age > p.maxAge) {
      // Respawn at a random position (biased toward the upwind edge so the field stays full)
      if (Math.random() < 0.7) {
        // Spawn anywhere
        p.x = Math.random() * w
        p.y = Math.random() * h
      } else {
        // Spawn on the upwind edge (opposite of travel)
        if (Math.abs(vx) > Math.abs(vy)) {
          p.x = vx > 0 ? -5 : w + 5
          p.y = Math.random() * h
        } else {
          p.x = Math.random() * w
          p.y = vy > 0 ? -5 : h + 5
        }
      }
      p.age = 0
      p.maxAge = 180 + Math.random() * 220
      p.jitter = 0.85 + Math.random() * 0.3
    }
    ctx.fillRect(p.x, p.y, 1.4, 1.4)
  }

  rafId = requestAnimationFrame(tick)
}

function start() {
  if (rafId != null) return
  fitCanvas()
  rafId = requestAnimationFrame(tick)
}

function stop() {
  if (rafId != null) cancelAnimationFrame(rafId)
  rafId = null
  const ctx = canvasRef.value?.getContext('2d')
  if (ctx && canvasRef.value) {
    ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
  }
}

onMounted(() => {
  if (!canvasRef.value) return
  if (props.enabled) start()
  resizeObs = new ResizeObserver(() => {
    fitCanvas()
  })
  if (canvasRef.value.parentElement) resizeObs.observe(canvasRef.value.parentElement)
})

onBeforeUnmount(() => {
  stop()
  resizeObs?.disconnect()
})

watch(() => props.enabled, (v) => {
  if (v) start()
  else stop()
})
</script>

<template>
  <canvas
    ref="canvasRef"
    class="wind-overlay"
    aria-hidden="true"
  />
</template>

<style scoped>
.wind-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  mix-blend-mode: screen;
}
</style>
