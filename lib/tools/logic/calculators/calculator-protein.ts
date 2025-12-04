/**
 * Protein Calculator - Business Logic
 * 
 * Calculate daily protein needs
 * MCP-compatible for AI agent integration
 * 
 * @module tools/logic/calculators/calculator-protein
 */

export interface ProteinInput {
  weight: number
  activity: "sedentary" | "light" | "moderate" | "active" | "athlete"
  goal: "maintain" | "lose" | "gain"
}

export interface ProteinOutput {
  minProtein: number
  maxProtein: number
  perMeal: string
}

export function validateProteinInput(input: ProteinInput): string | null {
  if (typeof input.weight !== "number" || input.weight <= 0) {
    return "Weight must be a positive number"
  }
  if (!["sedentary", "light", "moderate", "active", "athlete"].includes(input.activity)) {
    return "Invalid activity level"
  }
  if (!["maintain", "lose", "gain"].includes(input.goal)) {
    return "Invalid goal"
  }
  return null
}

export function calculateProtein(input: ProteinInput): ProteinOutput {
  const error = validateProteinInput(input)
  if (error) throw new Error(error)

  const proteinRanges: Record<string, Record<string, [number, number]>> = {
    sedentary: { maintain: [0.8, 1.0], lose: [1.0, 1.2], gain: [1.2, 1.4] },
    light: { maintain: [1.0, 1.2], lose: [1.2, 1.4], gain: [1.4, 1.6] },
    moderate: { maintain: [1.2, 1.4], lose: [1.4, 1.6], gain: [1.6, 1.8] },
    active: { maintain: [1.4, 1.6], lose: [1.6, 1.8], gain: [1.8, 2.0] },
    athlete: { maintain: [1.6, 1.8], lose: [1.8, 2.0], gain: [2.0, 2.2] },
  }

  const [minMultiplier, maxMultiplier] = proteinRanges[input.activity][input.goal]
  const minProtein = Math.round(input.weight * minMultiplier)
  const maxProtein = Math.round(input.weight * maxMultiplier)

  return {
    minProtein,
    maxProtein,
    perMeal: `${Math.round(minProtein / 3)}-${Math.round(maxProtein / 3)} grams`,
  }
}
