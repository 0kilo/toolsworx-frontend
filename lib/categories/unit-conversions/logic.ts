import { evaluate } from "mathjs"

/**
 * Generic conversion function using Math.js
 * Works for most unit conversions automatically!
 */
export function convertWithMathJs(value: number, fromUnit: string, toUnit: string): number {
  try {
    const result = evaluate(`${value} ${fromUnit} to ${toUnit}`)
    return typeof result === 'number' ? result : parseFloat(result.toString())
  } catch (error) {
    console.error('Conversion error:', error)
    throw new Error('Invalid conversion')
  }
}

/**
 * Temperature conversions
 */
export function convertTemperature(value: number, from: string, to: string): number {
  // Math.js handles these automatically
  return convertWithMathJs(value, from, to)
}

/**
 * Distance conversions
 */
export function convertDistance(value: number, from: string, to: string): number {
  // Math.js handles: km, m, cm, mm, mile, yard, feet, inch
  return convertWithMathJs(value, from, to)
}

/**
 * Weight conversions
 */
export function convertWeight(value: number, from: string, to: string): number {
  // Math.js handles: kg, g, mg, lb, oz, ton
  return convertWithMathJs(value, from, to)
}

/**
 * Volume conversions
 */
export function convertVolume(value: number, from: string, to: string): number {
  // Math.js handles: L, mL, gallon, quart, pint, cup, floz
  return convertWithMathJs(value, from, to)
}

/**
 * Time conversions
 */
export function convertTime(value: number, from: string, to: string): number {
  // Math.js handles: s, min, hour, day, week, month, year
  return convertWithMathJs(value, from, to)
}

/**
 * Format result with appropriate decimal places
 */
export function formatResult(value: number, decimals: number = 2): string {
  return value.toFixed(decimals)
}
