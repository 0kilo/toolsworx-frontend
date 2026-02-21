import { round } from "./common"

export interface PaceEtaInput {
  distanceKm: number
  paceMinPerKm: number
  breakMinutes: number
}

export interface PaceEtaResult {
  movingHours: number
  totalHours: number
}

export function calculatePaceEta(input: PaceEtaInput): PaceEtaResult {
  const movingMinutes = input.distanceKm * input.paceMinPerKm
  const fatigueMinutes = input.distanceKm > 15 ? (input.distanceKm - 15) * 0.9 : 0
  return {
    movingHours: round((movingMinutes + fatigueMinutes) / 60),
    totalHours: round((movingMinutes + fatigueMinutes + input.breakMinutes) / 60),
  }
}
