/**
 * Mortgage Calculator - Business Logic
 * 
 * Calculate mortgage payments and total interest
 * MCP-compatible for AI agent integration
 * 
 * @module tools/logic/calculators/calculator-mortgage
 */

export interface MortgageInput {
  loanAmount: number
  downPayment: number
  interestRate: number
  loanTerm: number
}

export interface MortgageOutput {
  monthlyPayment: number
  principal: number
  totalInterest: number
  totalPayment: number
  downPayment: number
}

export function validateMortgageInput(input: MortgageInput): string | null {
  if (typeof input.loanAmount !== "number" || input.loanAmount < 1000) {
    return "Loan amount must be at least 1,000"
  }
  if (typeof input.downPayment !== "number" || input.downPayment < 0) {
    return "Down payment must be a positive number"
  }
  if (typeof input.interestRate !== "number" || input.interestRate < 0 || input.interestRate > 30) {
    return "Interest rate must be between 0 and 30"
  }
  if (typeof input.loanTerm !== "number" || input.loanTerm < 1 || input.loanTerm > 40) {
    return "Loan term must be between 1 and 40 years"
  }
  return null
}

export function calculateMortgage(input: MortgageInput): MortgageOutput {
  const error = validateMortgageInput(input)
  if (error) throw new Error(error)

  const principal = input.loanAmount - input.downPayment
  const monthlyRate = input.interestRate / 100 / 12
  const numberOfPayments = input.loanTerm * 12

  const monthlyPayment =
    principal *
    (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1)

  const totalPayment = monthlyPayment * numberOfPayments
  const totalInterest = totalPayment - principal

  return {
    monthlyPayment: parseFloat(monthlyPayment.toFixed(2)),
    principal: parseFloat(principal.toFixed(2)),
    totalInterest: parseFloat(totalInterest.toFixed(2)),
    totalPayment: parseFloat(totalPayment.toFixed(2)),
    downPayment: parseFloat(input.downPayment.toFixed(2)),
  }
}
