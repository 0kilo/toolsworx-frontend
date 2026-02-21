import { round } from "./common"

export interface BudgetBufferInput {
  days: number
  dailyBudgetHome: number
  fixedCostsHome: number
  exchangeRateLocalPerHome: number
  fxBufferPercent: number
}

export interface BudgetBufferResult {
  totalHome: number
  bufferedHome: number
  bufferedLocal: number
}

export function calculateBudgetWithBuffer(input: BudgetBufferInput): BudgetBufferResult {
  const totalHome = input.days * input.dailyBudgetHome + input.fixedCostsHome
  const tripLengthContingency = input.days >= 10 ? 0.06 : input.days >= 5 ? 0.04 : 0.02
  const fxBuffer = input.fxBufferPercent / 100
  const bufferedHome = totalHome * (1 + fxBuffer + tripLengthContingency)
  const bufferedLocal = bufferedHome * input.exchangeRateLocalPerHome
  return {
    totalHome: round(totalHome),
    bufferedHome: round(bufferedHome),
    bufferedLocal: round(bufferedLocal),
  }
}
