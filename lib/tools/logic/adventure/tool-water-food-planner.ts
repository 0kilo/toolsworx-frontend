import { round } from "./common"

export interface WaterFoodInput {
  people: number
  days: number
  activityLevel: "low" | "medium" | "high"
  hotWeather: boolean
}

export interface WaterFoodResult {
  litersTotal: number
  caloriesTotal: number
}

export function calculateWaterFood(input: WaterFoodInput): WaterFoodResult {
  const activityFactor = input.activityLevel === "high" ? 1.35 : input.activityLevel === "medium" ? 1.15 : 1
  const heatFactor = input.hotWeather ? 1.2 : 1
  const litersPerPersonPerDay = Math.max(2.2, 2.5 * activityFactor * heatFactor)
  const caloriesPerPersonPerDay = 2200 * activityFactor
  return {
    litersTotal: round(input.people * input.days * litersPerPersonPerDay),
    caloriesTotal: round(input.people * input.days * caloriesPerPersonPerDay, 0),
  }
}
