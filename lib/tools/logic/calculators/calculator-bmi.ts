/**
 * BMI Calculator - Business Logic
 * 
 * Pure functions for Body Mass Index calculation
 * MCP-compatible for AI agent integration
 * 
 * @module tools/logic/calculators/calculator-bmi
 */

// Input/Output Types
export interface BMIInput {
  weight: number
  weightUnit: "kg" | "lbs"
  height: number
  heightUnit: "cm" | "in"
}

export interface BMIOutput {
  bmi: number
  category: "Underweight" | "Normal weight" | "Overweight" | "Obese"
  advice: string
}

// Validation
export function validateBMIInput(input: BMIInput): string | null {
  if (typeof input.weight !== "number" || isNaN(input.weight)) {
    return "Weight must be a valid number"
  }
  if (input.weight < 20 || input.weight > 500) {
    return "Weight must be between 20 and 500"
  }
  if (typeof input.height !== "number" || isNaN(input.height)) {
    return "Height must be a valid number"
  }
  if (input.height < 50 || input.height > 300) {
    return "Height must be between 50 and 300"
  }
  if (!["kg", "lbs"].includes(input.weightUnit)) {
    return "Weight unit must be 'kg' or 'lbs'"
  }
  if (!["cm", "in"].includes(input.heightUnit)) {
    return "Height unit must be 'cm' or 'in'"
  }
  return null
}

// Main Logic
export function calculateBMI(input: BMIInput): BMIOutput {
  const error = validateBMIInput(input)
  if (error) {
    throw new Error(error)
  }

  let weight = input.weight
  let height = input.height

  // Convert to metric
  if (input.weightUnit === "lbs") {
    weight = weight * 0.453592
  }
  if (input.heightUnit === "in") {
    height = height * 2.54
  }

  // Calculate BMI
  const heightInMeters = height / 100
  const bmi = weight / (heightInMeters * heightInMeters)

  // Determine category and advice
  const { category, advice } = getBMICategory(bmi)

  return {
    bmi: parseFloat(bmi.toFixed(1)),
    category,
    advice,
  }
}

// Helper Functions
function getBMICategory(bmi: number): {
  category: BMIOutput["category"]
  advice: string
} {
  if (bmi < 18.5) {
    return {
      category: "Underweight",
      advice: "Consider consulting a healthcare provider for guidance",
    }
  } else if (bmi < 25) {
    return {
      category: "Normal weight",
      advice: "Maintain your healthy lifestyle",
    }
  } else if (bmi < 30) {
    return {
      category: "Overweight",
      advice: "Consider a balanced diet and regular exercise",
    }
  } else {
    return {
      category: "Obese",
      advice: "Consult a healthcare provider for personalized advice",
    }
  }
}
