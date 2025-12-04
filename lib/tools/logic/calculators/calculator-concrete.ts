/**
 * Concrete Calculator - Business Logic
 * 
 * Calculate cubic yards of concrete needed
 * MCP-compatible for AI agent integration
 * 
 * @module tools/logic/calculators/calculator-concrete
 */

export interface ConcreteInput {
  length: number
  width: number
  depth: number
}

export interface ConcreteOutput {
  cubicYards: number
  cubicFeet: number
  withWaste: number
}

export function validateConcreteInput(input: ConcreteInput): string | null {
  if (typeof input.length !== "number" || input.length <= 0) {
    return "Length must be a positive number"
  }
  if (typeof input.width !== "number" || input.width <= 0) {
    return "Width must be a positive number"
  }
  if (typeof input.depth !== "number" || input.depth <= 0) {
    return "Depth must be a positive number"
  }
  return null
}

export function calculateConcrete(input: ConcreteInput): ConcreteOutput {
  const error = validateConcreteInput(input)
  if (error) throw new Error(error)

  const depthFeet = input.depth / 12
  const cubicFeet = input.length * input.width * depthFeet
  const cubicYards = cubicFeet / 27
  const withWaste = cubicYards * 1.1

  return {
    cubicYards: parseFloat(cubicYards.toFixed(2)),
    cubicFeet: Math.round(cubicFeet),
    withWaste: Math.ceil(withWaste),
  }
}
