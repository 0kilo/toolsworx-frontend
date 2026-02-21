import { round } from "./common"

export interface RoutePlannerInput {
  distanceKm: number
  avgSpeedKph: number
  fuelEfficiencyKmPerL: number
  fuelPricePerL: number
  tollCost: number
  breakMinutes: number
}

export interface RoutePlannerResult {
  drivingHours: number
  totalHours: number
  fuelLiters: number
  totalCost: number
}

export function calculateRoutePlan(input: RoutePlannerInput): RoutePlannerResult {
  const drivingHours = input.avgSpeedKph > 0 ? input.distanceKm / input.avgSpeedKph : 0
  const fatiguePenaltyHours = drivingHours > 6 ? (drivingHours - 6) * 0.08 : 0
  const totalHours = drivingHours + input.breakMinutes / 60 + fatiguePenaltyHours
  const baseFuelLiters = input.fuelEfficiencyKmPerL > 0 ? input.distanceKm / input.fuelEfficiencyKmPerL : 0
  const fuelLiters = baseFuelLiters * 1.08
  const totalCost = fuelLiters * input.fuelPricePerL + input.tollCost
  return {
    drivingHours: round(drivingHours),
    totalHours: round(totalHours),
    fuelLiters: round(fuelLiters),
    totalCost: round(totalCost),
  }
}
