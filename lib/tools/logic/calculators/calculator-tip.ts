/**
 * Tip Calculator - Business Logic
 * 
 * Calculate tips and split bills
 * MCP-compatible for AI agent integration
 * 
 * @module tools/logic/calculators/calculator-tip
 */

export interface TipInput {
  billAmount: number
  tipPercentage: number
  numberOfPeople: number
}

export interface TipOutput {
  tipAmount: number
  totalAmount: number
  perPersonBill: number
  perPersonTip: number
  perPersonTotal: number
}

export function validateTipInput(input: TipInput): string | null {
  if (typeof input.billAmount !== "number" || input.billAmount < 0) {
    return "Bill amount must be a positive number"
  }
  if (typeof input.tipPercentage !== "number" || input.tipPercentage < 0 || input.tipPercentage > 100) {
    return "Tip percentage must be between 0 and 100"
  }
  if (typeof input.numberOfPeople !== "number" || input.numberOfPeople < 1) {
    return "Number of people must be at least 1"
  }
  return null
}

export function calculateTip(input: TipInput): TipOutput {
  const error = validateTipInput(input)
  if (error) throw new Error(error)

  const tipAmount = input.billAmount * (input.tipPercentage / 100)
  const totalAmount = input.billAmount + tipAmount
  const perPersonBill = input.billAmount / input.numberOfPeople
  const perPersonTip = tipAmount / input.numberOfPeople
  const perPersonTotal = totalAmount / input.numberOfPeople

  return {
    tipAmount: parseFloat(tipAmount.toFixed(2)),
    totalAmount: parseFloat(totalAmount.toFixed(2)),
    perPersonBill: parseFloat(perPersonBill.toFixed(2)),
    perPersonTip: parseFloat(perPersonTip.toFixed(2)),
    perPersonTotal: parseFloat(perPersonTotal.toFixed(2)),
  }
}
