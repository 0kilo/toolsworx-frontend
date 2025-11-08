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
 * Energy conversions
 */
export function convertEnergy(value: number, from: string, to: string): number {
  // Convert to joules first
  let joules: number
  
  switch (from) {
    case "J": // Joules
      joules = value
      break
    case "kJ": // Kilojoules
      joules = value * 1000
      break
    case "cal": // Calories
      joules = value * 4.184
      break
    case "kcal": // Kilocalories
      joules = value * 4184
      break
    case "Wh": // Watt hours
      joules = value * 3600
      break
    case "kWh": // Kilowatt hours
      joules = value * 3600000
      break
    case "BTU": // British Thermal Units
      joules = value * 1055.06
      break
    case "eV": // Electron volts
      joules = value * 1.602176634e-19
      break
    case "keV": // Kiloelectron volts
      joules = value * 1.602176634e-16
      break
    case "MeV": // Megaelectron volts
      joules = value * 1.602176634e-13
      break
    case "GeV": // Gigaelectron volts
      joules = value * 1.602176634e-10
      break
    case "ft-lbf": // Foot-pounds force
      joules = value * 1.355818
      break
    default:
      throw new Error('Unknown energy unit')
  }
  
  // Convert from joules to target unit
  switch (to) {
    case "J":
      return joules
    case "kJ":
      return joules / 1000
    case "cal":
      return joules / 4.184
    case "kcal":
      return joules / 4184
    case "Wh":
      return joules / 3600
    case "kWh":
      return joules / 3600000
    case "BTU":
      return joules / 1055.06
    case "eV":
      return joules / 1.602176634e-19
    case "keV":
      return joules / 1.602176634e-16
    case "MeV":
      return joules / 1.602176634e-13
    case "GeV":
      return joules / 1.602176634e-10
    case "ft-lbf":
      return joules / 1.355818
    default:
      throw new Error('Unknown energy unit')
  }
}

/**
 * Space-time conversions
 */
export function convertSpaceTime(value: number, from: string, to: string): number {
  // Convert to meters first for distance units
  let meters: number
  
  switch (from) {
    case "m": // Meters
      meters = value
      break
    case "km": // Kilometers
      meters = value * 1000
      break
    case "AU": // Astronomical Units
      meters = value * 149597870700
      break
    case "ly": // Light years
      meters = value * 9.4607304725808e15
      break
    case "pc": // Parsecs
      meters = value * 3.0857e16
      break
    case "kpc": // Kiloparsecs
      meters = value * 3.0857e19
      break
    case "Mpc": // Megaparsecs
      meters = value * 3.0857e22
      break
    case "Gpc": // Gigaparsecs
      meters = value * 3.0857e25
      break
    case "ls": // Light seconds
      meters = value * 299792458
      break
    case "lm": // Light minutes
      meters = value * 17987547480
      break
    case "lh": // Light hours
      meters = value * 1079252848800
      break
    case "ld": // Light days
      meters = value * 25902068371200
      break
    default:
      throw new Error('Unknown space-time unit')
  }
  
  // Convert from meters to target unit
  switch (to) {
    case "m":
      return meters
    case "km":
      return meters / 1000
    case "AU":
      return meters / 149597870700
    case "ly":
      return meters / 9.4607304725808e15
    case "pc":
      return meters / 3.0857e16
    case "kpc":
      return meters / 3.0857e19
    case "Mpc":
      return meters / 3.0857e22
    case "Gpc":
      return meters / 3.0857e25
    case "ls":
      return meters / 299792458
    case "lm":
      return meters / 17987547480
    case "lh":
      return meters / 1079252848800
    case "ld":
      return meters / 25902068371200
    default:
      throw new Error('Unknown space-time unit')
  }
}

/**
 * Format result with appropriate decimal places
 */
export function formatResult(value: number, decimals: number = 2): string {
  return value.toFixed(decimals)
}
