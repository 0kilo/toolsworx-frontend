import { round } from "./common"

export interface RideFuelingInput {
  durationHours: number
  intensity: "easy" | "moderate" | "hard"
}

export interface RideFuelingResult {
  carbsPerHour: number
  fluidMlPerHour: number
  sodiumMgPerHour: number
  carbsTotal: number
}

export function calculateRideFueling(input: RideFuelingInput): RideFuelingResult {
  const carbsPerHour = input.intensity === "hard" ? 90 : input.intensity === "moderate" ? 70 : 45
  const longRideFactor = input.durationHours >= 4 ? 1.08 : 1
  const fluidMlPerHourBase = input.intensity === "hard" ? 850 : input.intensity === "moderate" ? 700 : 550
  const sodiumMgPerHourBase = input.intensity === "hard" ? 900 : input.intensity === "moderate" ? 700 : 500
  const fluidMlPerHour = round(fluidMlPerHourBase * longRideFactor, 0)
  const sodiumMgPerHour = round(sodiumMgPerHourBase * longRideFactor, 0)
  return {
    carbsPerHour,
    fluidMlPerHour,
    sodiumMgPerHour,
    carbsTotal: round(carbsPerHour * input.durationHours),
  }
}
