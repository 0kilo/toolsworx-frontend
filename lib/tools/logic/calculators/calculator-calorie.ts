/**
 * Calorie Calculator - Business Logic
 * 
 * Calculate daily calorie needs using Mifflin-St Jeor Equation
 * MCP-compatible for AI agent integration
 * 
 * @module tools/logic/calculators/calculator-calorie
 */

export interface CalorieInput {
  age: number
  gender: "male" | "female"
  weight: number
  height: number
  activity: "sedentary" | "light" | "moderate" | "active" | "very_active"
}

export interface CalorieOutput {
  dailyCalories: number
  weightLoss: number
  weightGain: number
}

export function validateCalorieInput(input: CalorieInput): string | null {
  if (typeof input.age !== "number" || input.age < 1 || input.age > 120) {
    return "Age must be between 1 and 120"
  }
  if (!["male", "female"].includes(input.gender)) {
    return "Gender must be 'male' or 'female'"
  }
  if (typeof input.weight !== "number" || input.weight < 20 || input.weight > 500) {
    return "Weight must be between 20 and 500 kg"
  }
  if (typeof input.height !== "number" || input.height < 50 || input.height > 300) {
    return "Height must be between 50 and 300 cm"
  }
  if (!["sedentary", "light", "moderate", "active", "very_active"].includes(input.activity)) {
    return "Invalid activity level"
  }
  return null
}

export function calculateCalories(input: CalorieInput): CalorieOutput {
  const error = validateCalorieInput(input)
  if (error) throw new Error(error)

  // Mifflin-St Jeor Equation
  let bmr: number
  if (input.gender === "male") {
    bmr = 10 * input.weight + 6.25 * input.height - 5 * input.age + 5
  } else {
    bmr = 10 * input.weight + 6.25 * input.height - 5 * input.age - 161
  }

  const activityMultipliers: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  }

  const tdee = bmr * activityMultipliers[input.activity]

  return {
    dailyCalories: Math.round(tdee),
    weightLoss: Math.round(tdee - 500),
    weightGain: Math.round(tdee + 500),
  }
}
