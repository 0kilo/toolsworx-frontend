/**
 * Percentage Calculator - Business Logic
 * 
 * Calculate percentages, increases, and decreases
 * MCP-compatible for AI agent integration
 * 
 * @module tools/logic/calculators/calculator-percentage
 */

export interface PercentageInput {
  value: number
  percentage: number
  total?: number
}

export interface PercentageOutput {
  percentageOf?: number
  valueAsPercentage?: number
  increase?: number
  decrease?: number
}

export function validatePercentageInput(input: PercentageInput): string | null {
  if (typeof input.value !== "number") {
    return "Value must be a number"
  }
  if (typeof input.percentage !== "number") {
    return "Percentage must be a number"
  }
  if (input.total !== undefined && typeof input.total !== "number") {
    return "Total must be a number"
  }
  return null
}

export function calculatePercentage(input: PercentageInput): PercentageOutput {
  const error = validatePercentageInput(input)
  if (error) throw new Error(error)

  const output: PercentageOutput = {}

  if (input.value && input.percentage) {
    output.percentageOf = parseFloat(((input.value * input.percentage) / 100).toFixed(2))
    output.increase = parseFloat((input.value + (input.value * input.percentage) / 100).toFixed(2))
    output.decrease = parseFloat((input.value - (input.value * input.percentage) / 100).toFixed(2))
  }

  if (input.value && input.total && input.total !== 0) {
    output.valueAsPercentage = parseFloat(((input.value / input.total) * 100).toFixed(2))
  }

  return output
}
