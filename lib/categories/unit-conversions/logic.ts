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
  const energyToJoules: Record<string, number> = {
    nJ: 1e-9,
    uJ: 1e-6,
    mJ: 1e-3,
    J: 1,
    kJ: 1e3,
    MJ: 1e6,
    GJ: 1e9,
    cal: 4.184,
    kcal: 4184,
    Wh: 3600,
    kWh: 3.6e6,
    MWh: 3.6e9,
    BTU: 1055.05585262,
    therm: 105480400,
    erg: 1e-7,
    eV: 1.602176634e-19,
    keV: 1.602176634e-16,
    MeV: 1.602176634e-13,
    GeV: 1.602176634e-10,
    "ft-lbf": 1.3558179483314,
    "ton-TNT": 4.184e9,
  }

  const fromFactor = energyToJoules[from]
  const toFactor = energyToJoules[to]

  if (!fromFactor || !toFactor) {
    throw new Error("Unknown energy unit")
  }

  const joules = value * fromFactor
  return joules / toFactor
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
