import { round } from "./common"

export interface RideRangeInput {
  tankLiters: number
  kmPerLiter: number
  reservePercent: number
  routeDistanceKm: number
}

export interface RideRangeResult {
  safeRangeKm: number
  stopIntervalKm: number
  estimatedStops: number
}

export function calculateRideRange(input: RideRangeInput): RideRangeResult {
  const usableLiters = input.tankLiters * (1 - input.reservePercent / 100)
  const realWorldEfficiency = input.kmPerLiter * 0.92
  const safeRangeKm = usableLiters * realWorldEfficiency
  const stopIntervalKm = safeRangeKm * 0.85
  const estimatedStops = stopIntervalKm > 0 ? Math.max(0, Math.ceil(input.routeDistanceKm / stopIntervalKm) - 1) : 0
  return {
    safeRangeKm: round(safeRangeKm),
    stopIntervalKm: round(stopIntervalKm),
    estimatedStops,
  }
}
