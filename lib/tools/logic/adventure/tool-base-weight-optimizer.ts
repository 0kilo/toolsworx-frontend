import { round } from "./common"

export interface GearItem {
  name: string
  weightKg: number
}

export interface BaseWeightResult {
  totalKg: number
  topItems: GearItem[]
}

export function analyzeBaseWeight(items: GearItem[]): BaseWeightResult {
  const cleaned = items.filter((i) => i.name.trim() && i.weightKg > 0)
  const totalKg = cleaned.reduce((sum, item) => sum + item.weightKg, 0)
  const topItems = [...cleaned].sort((a, b) => b.weightKg - a.weightKg).slice(0, 5)
  return { totalKg: round(totalKg), topItems }
}
