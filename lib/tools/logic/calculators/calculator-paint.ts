/**
 * Paint Calculator - Business Logic
 * 
 * Calculate gallons of paint needed
 * MCP-compatible for AI agent integration
 * 
 * @module tools/logic/calculators/calculator-paint
 */

export interface PaintInput {
  length: number
  width: number
  height: number
  coats: number
}

export interface PaintOutput {
  totalGallons: number
  wallArea: number
  gallonsPerCoat: number
}

export function validatePaintInput(input: PaintInput): string | null {
  if (typeof input.length !== "number" || input.length <= 0) {
    return "Length must be a positive number"
  }
  if (typeof input.width !== "number" || input.width <= 0) {
    return "Width must be a positive number"
  }
  if (typeof input.height !== "number" || input.height <= 0) {
    return "Height must be a positive number"
  }
  if (typeof input.coats !== "number" || input.coats < 1 || input.coats > 10) {
    return "Coats must be between 1 and 10"
  }
  return null
}

export function calculatePaint(input: PaintInput): PaintOutput {
  const error = validatePaintInput(input)
  if (error) throw new Error(error)

  const wallArea = 2 * (input.length * input.height) + 2 * (input.width * input.height)
  const gallonsPerCoat = wallArea / 350
  const totalGallons = gallonsPerCoat * input.coats

  return {
    totalGallons: Math.ceil(totalGallons),
    wallArea: Math.round(wallArea),
    gallonsPerCoat: Math.ceil(gallonsPerCoat),
  }
}
