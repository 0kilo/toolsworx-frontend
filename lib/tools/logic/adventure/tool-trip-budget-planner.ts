/**
 * Trip Budget Planner Logic
 * Consolidated budget planning with daily expenses and currency conversion
 */

export interface TripBudgetInput {
  days: number
  // Daily expenses
  fuelPerDay: number
  lodgingPerDay: number
  mealsPerDay: number
  activitiesPerDay: number
  miscPerDay: number
  // Fixed costs
  fixedCosts: number
  // Currency conversion
  exchangeRateLocalPerHome: number
  bufferPercent: number
}

export interface TripBudgetResult {
  // Daily totals
  perDayHome: number
  perDayLocal: number
  // Trip totals
  dailyTotalHome: number
  dailyTotalLocal: number
  fixedCostsHome: number
  fixedCostsLocal: number
  // Grand totals
  baseTotalHome: number
  baseTotalLocal: number
  bufferAmountHome: number
  bufferAmountLocal: number
  bufferedTotalHome: number
  bufferedTotalLocal: number
  // Breakdown
  categoryBreakdown: Record<string, number>
}

export function calculateTripBudget(input: TripBudgetInput): TripBudgetResult {
  // Calculate daily expenses in home currency
  const perDayHome =
    input.fuelPerDay +
    input.lodgingPerDay +
    input.mealsPerDay +
    input.activitiesPerDay +
    input.miscPerDay

  // Calculate daily expenses in local currency
  const perDayLocal = perDayHome * input.exchangeRateLocalPerHome

  // Calculate total daily expenses for the trip
  const dailyTotalHome = perDayHome * input.days
  const dailyTotalLocal = dailyTotalHome * input.exchangeRateLocalPerHome

  // Fixed costs
  const fixedCostsHome = input.fixedCosts
  const fixedCostsLocal = fixedCostsHome * input.exchangeRateLocalPerHome

  // Base totals (without buffer)
  const baseTotalHome = dailyTotalHome + fixedCostsHome
  const baseTotalLocal = baseTotalHome * input.exchangeRateLocalPerHome

  // Buffer calculation
  const bufferAmountHome = baseTotalHome * (input.bufferPercent / 100)
  const bufferAmountLocal = bufferAmountHome * input.exchangeRateLocalPerHome

  // Buffered totals
  const bufferedTotalHome = baseTotalHome + bufferAmountHome
  const bufferedTotalLocal = baseTotalLocal + bufferAmountLocal

  // Category breakdown (home currency)
  const categoryBreakdown: Record<string, number> = {
    fuel: input.fuelPerDay * input.days,
    lodging: input.lodgingPerDay * input.days,
    meals: input.mealsPerDay * input.days,
    activities: input.activitiesPerDay * input.days,
    misc: input.miscPerDay * input.days,
    fixed: fixedCostsHome,
  }

  return {
    perDayHome: Math.round(perDayHome * 100) / 100,
    perDayLocal: Math.round(perDayLocal * 100) / 100,
    dailyTotalHome: Math.round(dailyTotalHome * 100) / 100,
    dailyTotalLocal: Math.round(dailyTotalLocal * 100) / 100,
    fixedCostsHome: Math.round(fixedCostsHome * 100) / 100,
    fixedCostsLocal: Math.round(fixedCostsLocal * 100) / 100,
    baseTotalHome: Math.round(baseTotalHome * 100) / 100,
    baseTotalLocal: Math.round(baseTotalLocal * 100) / 100,
    bufferAmountHome: Math.round(bufferAmountHome * 100) / 100,
    bufferAmountLocal: Math.round(bufferAmountLocal * 100) / 100,
    bufferedTotalHome: Math.round(bufferedTotalHome * 100) / 100,
    bufferedTotalLocal: Math.round(bufferedTotalLocal * 100) / 100,
    categoryBreakdown,
  }
}

export interface QuickBudgetInput {
  days: number
  dailyBudget: number
  fixedCosts: number
}

export interface QuickBudgetResult {
  dailyTotal: number
  fixedCosts: number
  totalWithFixed: number
  perDay: number
}

export function calculateQuickBudget(input: QuickBudgetInput): QuickBudgetResult {
  const dailyTotal = input.dailyBudget * input.days
  const totalWithFixed = dailyTotal + input.fixedCosts
  const perDay = totalWithFixed / input.days

  return {
    dailyTotal: Math.round(dailyTotal * 100) / 100,
    fixedCosts: Math.round(input.fixedCosts * 100) / 100,
    totalWithFixed: Math.round(totalWithFixed * 100) / 100,
    perDay: Math.round(perDay * 100) / 100,
  }
}
