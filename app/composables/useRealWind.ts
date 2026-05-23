import { LEAK_COORDS } from './useHazardConstants'

interface OpenMeteoResponse {
  hourly?: {
    time: string[]
    wind_speed_10m: number[]      // km/h
    wind_direction_10m: number[]  // degrees, meteorological (FROM)
  }
}

interface RealWindState {
  windFromDeg: number | null
  windSpeedMph: number | null
  fetchedAt: number | null
  error: string | null
  loading: boolean
}

const KMH_TO_MPH = 0.621371

const state = reactive<RealWindState>({
  windFromDeg: null,
  windSpeedMph: null,
  fetchedAt: null,
  error: null,
  loading: false
})

let _inflight: Promise<void> | null = null

function cacheKey() {
  const d = new Date()
  return `open-meteo:${d.getUTCFullYear()}-${d.getUTCMonth()}-${d.getUTCDate()}-${d.getUTCHours()}`
}

async function fetchOnce() {
  if (state.loading) return _inflight ?? Promise.resolve()
  state.loading = true
  state.error = null
  _inflight = (async () => {
    try {
      // Session cache: avoid refetching within the same hour
      const key = cacheKey()
      const cached = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem(key) : null
      if (cached) {
        const parsed = JSON.parse(cached) as { fromDeg: number; speedMph: number; at: number }
        state.windFromDeg = parsed.fromDeg
        state.windSpeedMph = parsed.speedMph
        state.fetchedAt = parsed.at
        return
      }

      const [lon, lat] = LEAK_COORDS
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat.toFixed(4)}&longitude=${lon.toFixed(4)}&hourly=wind_speed_10m,wind_direction_10m&forecast_days=1&timezone=America%2FLos_Angeles&wind_speed_unit=kmh`
      const res = await fetch(url)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = (await res.json()) as OpenMeteoResponse

      const now = new Date()
      const nowHourIso = now.toISOString().slice(0, 13)
      const times = data.hourly?.time ?? []
      // Open-Meteo returns local-tz timestamps; find the one matching the current local hour.
      const localHour = new Date(now.getTime() - now.getTimezoneOffset() * 60_000).toISOString().slice(0, 13)
      let idx = times.findIndex(t => t.startsWith(localHour) || t.startsWith(nowHourIso))
      if (idx === -1) idx = 0

      const speedKmh = data.hourly?.wind_speed_10m?.[idx] ?? 0
      const fromDeg = data.hourly?.wind_direction_10m?.[idx] ?? 0
      const speedMph = Math.round(speedKmh * KMH_TO_MPH)

      state.windFromDeg = Math.round(fromDeg)
      state.windSpeedMph = speedMph
      state.fetchedAt = Date.now()

      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem(key, JSON.stringify({
          fromDeg: state.windFromDeg,
          speedMph: state.windSpeedMph,
          at: state.fetchedAt
        }))
      }
    } catch (e) {
      state.error = e instanceof Error ? e.message : String(e)
    } finally {
      state.loading = false
    }
  })()
  return _inflight
}

function maybeFetch() {
  if (!import.meta.client) return
  if (state.windFromDeg !== null) return
  if (state.loading || state.error) return
  fetchOnce()
}

export function useRealWind() {
  // Trigger the fetch only after mount so SSR and the first client render agree.
  if (getCurrentInstance()) {
    onMounted(maybeFetch)
  } else if (import.meta.client) {
    maybeFetch()
  }
  return {
    windFromDeg: computed(() => state.windFromDeg),
    windSpeedMph: computed(() => state.windSpeedMph),
    fetchedAt: computed(() => state.fetchedAt),
    error: computed(() => state.error),
    loading: computed(() => state.loading),
    refetch: fetchOnce
  }
}
