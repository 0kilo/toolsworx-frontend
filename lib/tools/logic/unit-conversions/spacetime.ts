/**
 * Space-Time Lorentz Transformation Logic
 * Pure functions for special relativity calculations
 */

export interface LorentzInput {
  x: number
  t: number
  v: number
}

export interface LorentzOutput {
  xPrime: number
  tPrime: number
  gamma: number
  beta: number
}

const c = 299792458

export function calculateLorentzTransformation(input: LorentzInput): LorentzOutput {
  if (Math.abs(input.v) >= c) {
    throw new Error('Velocity must be less than speed of light')
  }

  const beta = input.v / c
  const gamma = 1 / Math.sqrt(1 - beta * beta)

  const xPrime = gamma * (input.x - input.v * input.t)
  const tPrime = gamma * (input.t - (input.v * input.x) / (c * c))

  return { xPrime, tPrime, gamma, beta }
}
