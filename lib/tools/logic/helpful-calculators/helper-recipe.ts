/**
 * Recipe Scaler Logic
 * Pure functions for scaling recipe ingredients
 */

export interface Ingredient {
  id: number
  amount: string
  unit: string
  name: string
}

export interface RecipeScaleInput {
  ingredients: Ingredient[]
  originalServings: number
  targetServings: number
}

export interface RecipeScaleOutput {
  scaledIngredients: Ingredient[]
}

export function parseAmount(amount: string): number {
  const trimmed = amount.trim()

  const mixedMatch = trimmed.match(/^(\d+)\s+(\d+)\/(\d+)$/)
  if (mixedMatch) {
    const whole = parseInt(mixedMatch[1])
    const numerator = parseInt(mixedMatch[2])
    const denominator = parseInt(mixedMatch[3])
    return whole + (numerator / denominator)
  }

  const fractionMatch = trimmed.match(/^(\d+)\/(\d+)$/)
  if (fractionMatch) {
    const numerator = parseInt(fractionMatch[1])
    const denominator = parseInt(fractionMatch[2])
    return numerator / denominator
  }

  return parseFloat(trimmed) || 0
}

export function formatAmount(num: number): string {
  if (num === 0) return "0"
  if (num % 1 === 0) return num.toString()

  const fractions: { [key: number]: string } = {
    0.25: "1/4",
    0.33: "1/3",
    0.5: "1/2",
    0.66: "2/3",
    0.75: "3/4"
  }

  const whole = Math.floor(num)
  const decimal = num - whole

  for (const [value, fraction] of Object.entries(fractions)) {
    if (Math.abs(decimal - parseFloat(value)) < 0.01) {
      return whole > 0 ? `${whole} ${fraction}` : fraction
    }
  }

  return num.toFixed(2).replace(/\.?0+$/, '')
}

export function scaleRecipe(input: RecipeScaleInput): RecipeScaleOutput {
  const multiplier = input.targetServings / input.originalServings

  const scaledIngredients = input.ingredients.map(ingredient => {
    const amount = parseAmount(ingredient.amount)
    const scaledAmount = amount * multiplier
    return {
      ...ingredient,
      amount: formatAmount(scaledAmount)
    }
  })

  return { scaledIngredients }
}
