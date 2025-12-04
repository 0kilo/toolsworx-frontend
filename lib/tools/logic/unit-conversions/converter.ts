/**
 * Unit Conversion Logic
 * Pure functions for converting between different units
 */

export interface Unit {
  value: string
  label: string
  abbreviation: string
  factor: number
}

export interface ConversionInput {
  value: number
  fromUnit: string
  toUnit: string
  units: Unit[]
}

export interface ConversionOutput {
  result: number
}

export function convertUnit(input: ConversionInput): ConversionOutput {
  const from = input.units.find(u => u.value === input.fromUnit)
  const to = input.units.find(u => u.value === input.toUnit)

  if (!from || !to) {
    throw new Error('Invalid units')
  }

  const baseValue = input.value * from.factor
  const result = baseValue / to.factor

  return { result }
}
