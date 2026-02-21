import { clamp, round } from "./common"

export interface WeatherRiskInput {
  precipProbability: number
  windKph: number
  lowTempC: number
  highTempC: number
}

export interface WeatherRiskResult {
  score: number
  level: "Low" | "Moderate" | "High"
}

export function calculateWeatherWindowRisk(input: WeatherRiskInput): WeatherRiskResult {
  const tempSpread = Math.abs(input.highTempC - input.lowTempC)
  const coldPenalty = input.lowTempC < 0 ? Math.abs(input.lowTempC) * 1.2 : 0
  const heatPenalty = input.highTempC > 34 ? (input.highTempC - 34) * 1.5 : 0
  const gustPenalty = input.windKph > 35 ? (input.windKph - 35) * 0.8 : 0
  const rainWeight = input.precipProbability > 60 ? 0.65 : 0.5
  const raw =
    input.precipProbability * rainWeight +
    input.windKph * 0.7 +
    tempSpread * 1.4 +
    coldPenalty +
    heatPenalty +
    gustPenalty
  const score = clamp(round(raw), 0, 100)
  const level = score >= 67 ? "High" : score >= 34 ? "Moderate" : "Low"
  return { score, level }
}
