import { DEFAULT_WIND_FROM_DEG, DEFAULT_WIND_SPEED_MPH } from './useHazardConstants'

export type WindDisplayMode = 'real' | 'what-if' | 'off'

const _windFromDeg = ref(DEFAULT_WIND_FROM_DEG)
const _windSpeedMph = ref(DEFAULT_WIND_SPEED_MPH)
const _displayMode = ref<WindDisplayMode>('real')

export function useWind() {
  return {
    windFromDeg: _windFromDeg,
    windSpeedMph: _windSpeedMph,
    displayMode: _displayMode,
    reset() {
      _windFromDeg.value = DEFAULT_WIND_FROM_DEG
      _windSpeedMph.value = DEFAULT_WIND_SPEED_MPH
    }
  }
}
