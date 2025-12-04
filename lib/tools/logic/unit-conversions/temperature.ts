/**
 * Temperature Conversion Logic
 * Pure functions for temperature conversion between scales
 */

export interface TemperatureConversionInput {
  value: number
  fromUnit: string
  toUnit: string
}

export interface TemperatureConversionOutput {
  result: number
}

export function convertTemperature(input: TemperatureConversionInput): TemperatureConversionOutput {
  let celsius: number

  switch (input.fromUnit) {
    case "celsius":
      celsius = input.value
      break
    case "fahrenheit":
      celsius = (input.value - 32) * 5/9
      break
    case "kelvin":
      celsius = input.value - 273.15
      break
    case "rankine":
      celsius = (input.value - 491.67) * 5/9
      break
    default:
      throw new Error('Unknown temperature unit')
  }

  let result: number
  switch (input.toUnit) {
    case "celsius":
      result = celsius
      break
    case "fahrenheit":
      result = celsius * 9/5 + 32
      break
    case "kelvin":
      result = celsius + 273.15
      break
    case "rankine":
      result = celsius * 9/5 + 491.67
      break
    default:
      throw new Error('Unknown temperature unit')
  }

  return { result }
}
