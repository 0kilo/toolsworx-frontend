/**
 * Flooring Calculator - Business Logic
 * 
 * Calculate square footage and materials needed
 * MCP-compatible for AI agent integration
 * 
 * @module tools/logic/calculators/calculator-flooring
 */

export interface FlooringInput {
  length: number
  width: number
  waste: number
}

export interface FlooringOutput {
  totalArea: number
  roomArea: number
  wasteAmount: number
}

export function validateFlooringInput(input: FlooringInput): string | null {
  if (typeof input.length !== "number" || input.length <= 0) {
    return "Length must be a positive number"
  }
  if (typeof input.width !== "number" || input.width <= 0) {
    return "Width must be a positive number"
  }
  if (typeof input.waste !== "number" || input.waste < 0 || input.waste > 100) {
    return "Waste factor must be between 0 and 100"
  }
  return null
}

export function calculateFlooring(input: FlooringInput): FlooringOutput {
  const error = validateFlooringInput(input)
  if (error) throw new Error(error)

  const area = input.length * input.width
  const wasteAmount = area * (input.waste / 100)
  const totalArea = area + wasteAmount

  return {
    totalArea: Math.ceil(totalArea),
    roomArea: Math.round(area),
    wasteAmount: Math.round(wasteAmount),
  }
}
