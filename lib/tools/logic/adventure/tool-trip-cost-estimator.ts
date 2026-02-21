import { round } from "./common"

export interface TripCostInput {
  days: number
  fuelPerDay: number
  lodgingPerDay: number
  mealsPerDay: number
  activitiesPerDay: number
  miscPerDay: number
}

export interface TripCostResult {
  perDay: number
  total: number
}

export function calculateTripCost(input: TripCostInput): TripCostResult {
  const perDay = input.fuelPerDay + input.lodgingPerDay + input.mealsPerDay + input.activitiesPerDay + input.miscPerDay
  const contingency = perDay * 0.07
  return {
    perDay: round(perDay + contingency),
    total: round((perDay + contingency) * input.days),
  }
}
