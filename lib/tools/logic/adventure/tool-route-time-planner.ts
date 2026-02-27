/**
 * Route & Time Planner Logic
 * Consolidated route planning for driving, cycling, hiking, and motorcycle
 */

export interface RoutePlanResult {
  movingTimeHours: number
  totalTimeHours: number
  fuelLiters?: number
  fuelStops?: number
  cost?: number
  safeRangeKm?: number
  stopIntervalKm?: number
}

export interface RouteInput {
  mode: 'driving' | 'cycling' | 'hiking' | 'motorcycle'
  distanceKm: number
  speedKph: number
  breakMinutes: number
  fuelEfficiencyKmPerL?: number
  fuelPricePerL?: number
  tollCost?: number
  tankSizeLiters?: number
  reservePercent?: number
}

export function calculateRoutePlan(input: RouteInput): RoutePlanResult {
  const movingTimeHours = input.distanceKm / input.speedKph
  const breakHours = input.breakMinutes / 60
  const totalTimeHours = movingTimeHours + breakHours

  const result: RoutePlanResult = {
    movingTimeHours: Math.round(movingTimeHours * 10) / 10,
    totalTimeHours: Math.round(totalTimeHours * 10) / 10,
  }

  // Fuel calculation for driving and motorcycle
  if ((input.mode === 'driving' || input.mode === 'motorcycle') && input.fuelEfficiencyKmPerL) {
    result.fuelLiters = Math.round((input.distanceKm / input.fuelEfficiencyKmPerL) * 10) / 10

    if (input.fuelPricePerL) {
      const fuelCost = result.fuelLiters * input.fuelPricePerL
      result.cost = Math.round((fuelCost + (input.tollCost || 0)) * 100) / 100
    }
  }

  // Fuel stop planning for motorcycle
  if (input.mode === 'motorcycle' && input.tankSizeLiters && input.fuelEfficiencyKmPerL) {
    const safeRangeKm = input.tankSizeLiters * input.fuelEfficiencyKmPerL * (1 - (input.reservePercent || 10) / 100)
    result.safeRangeKm = Math.round(safeRangeKm)
    result.stopIntervalKm = Math.round(safeRangeKm * 0.8) // Stop at 80% of safe range
    result.fuelStops = Math.ceil(input.distanceKm / result.stopIntervalKm) - 1
  }

  return result
}

export interface PaceEtaInput {
  distanceKm: number
  paceMinPerKm: number
  breakMinutes: number
}

export interface PaceEtaResult {
  movingTimeHours: number
  totalTimeHours: number
  pacePerKm: string
}

export function calculatePaceEta(input: PaceEtaInput): PaceEtaResult {
  const movingTimeMinutes = input.distanceKm * input.paceMinPerKm
  const movingTimeHours = movingTimeMinutes / 60
  const totalTimeHours = movingTimeHours + input.breakMinutes / 60

  const mins = Math.floor(input.paceMinPerKm)
  const secs = Math.round((input.paceMinPerKm - mins) * 60)

  return {
    movingTimeHours: Math.round(movingTimeHours * 10) / 10,
    totalTimeHours: Math.round(totalTimeHours * 10) / 10,
    pacePerKm: secs > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : `${mins}:00`,
  }
}

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
  fuelNeededLiters: number
}

export function calculateRideRange(input: RideRangeInput): RideRangeResult {
  const safeRangeKm = input.tankLiters * input.kmPerLiter * (1 - input.reservePercent / 100)
  const stopIntervalKm = safeRangeKm * 0.8
  const estimatedStops = Math.max(0, Math.ceil(input.routeDistanceKm / stopIntervalKm) - 1)
  const fuelNeededLiters = input.routeDistanceKm / input.kmPerLiter

  return {
    safeRangeKm: Math.round(safeRangeKm),
    stopIntervalKm: Math.round(stopIntervalKm),
    estimatedStops,
    fuelNeededLiters: Math.round(fuelNeededLiters * 10) / 10,
  }
}

export const MODE_DEFAULTS: Record<string, { speedKph: number, paceMinPerKm?: number }> = {
  driving: { speedKph: 80 },
  cycling: { speedKph: 20, paceMinPerKm: 3 },
  hiking: { speedKph: 5, paceMinPerKm: 12 },
  motorcycle: { speedKph: 60 },
}

export const MODE_LABELS: Record<string, string> = {
  driving: 'Driving / Car',
  cycling: 'Cycling',
  hiking: 'Hiking / Walking',
  motorcycle: 'Motorcycle',
}
