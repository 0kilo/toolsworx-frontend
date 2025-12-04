/**
 * Loan Calculator - Business Logic
 * 
 * Calculate loan payments, interest, and total cost
 * MCP-compatible for AI agent integration
 * 
 * @module tools/logic/calculators/calculator-loan
 */

export interface LoanInput {
  principal: number
  downPayment?: number
  interestRate: number
  loanTerm: number
}

export interface LoanOutput {
  monthlyPayment: number
  principal: number
  totalInterest: number
  totalPaid: number
  interestPercentage: number
  downPayment?: number
}

export function validateLoanInput(input: LoanInput): string | null {
  if (typeof input.principal !== "number" || input.principal < 1000 || input.principal > 10000000) {
    return "Principal must be between 1,000 and 10,000,000"
  }
  if (input.downPayment !== undefined && (typeof input.downPayment !== "number" || input.downPayment < 0)) {
    return "Down payment must be a positive number"
  }
  if (typeof input.interestRate !== "number" || input.interestRate < 0.1 || input.interestRate > 50) {
    return "Interest rate must be between 0.1 and 50"
  }
  if (typeof input.loanTerm !== "number" || input.loanTerm < 1 || input.loanTerm > 50) {
    return "Loan term must be between 1 and 50 years"
  }
  return null
}

export function calculateLoan(input: LoanInput): LoanOutput {
  const error = validateLoanInput(input)
  if (error) throw new Error(error)

  const downPayment = input.downPayment || 0
  const principal = input.principal - downPayment
  const monthlyRate = input.interestRate / 100 / 12
  const totalPayments = input.loanTerm * 12

  const monthlyPayment = principal * 
    (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / 
    (Math.pow(1 + monthlyRate, totalPayments) - 1)

  const totalPaid = monthlyPayment * totalPayments
  const totalInterest = totalPaid - principal

  return {
    monthlyPayment: parseFloat(monthlyPayment.toFixed(2)),
    principal: parseFloat(principal.toFixed(2)),
    totalInterest: parseFloat(totalInterest.toFixed(2)),
    totalPaid: parseFloat(totalPaid.toFixed(2)),
    interestPercentage: parseFloat(((totalInterest / principal) * 100).toFixed(1)),
    ...(downPayment > 0 && { downPayment: parseFloat(downPayment.toFixed(2)) }),
  }
}
