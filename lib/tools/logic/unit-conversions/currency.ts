/**
 * Currency Conversion Logic
 * Pure functions for currency conversion with exchange rates
 */

export interface CurrencyConversionInput {
  value: number
  fromCurrency: string
  toCurrency: string
  rates: Record<string, number>
}

export interface CurrencyConversionOutput {
  result: number
}

export function convertCurrency(input: CurrencyConversionInput): CurrencyConversionOutput {
  if (input.fromCurrency === 'USD') {
    if (!input.rates[input.toCurrency]) {
      throw new Error('Exchange rate not available')
    }
    const result = input.value * input.rates[input.toCurrency]
    return { result }
  } else if (input.toCurrency === 'USD') {
    if (!input.rates[input.fromCurrency]) {
      throw new Error('Exchange rate not available')
    }
    const result = input.value / input.rates[input.fromCurrency]
    return { result }
  } else {
    if (!input.rates[input.fromCurrency] || !input.rates[input.toCurrency]) {
      throw new Error('Exchange rate not available')
    }
    const usdAmount = input.value / input.rates[input.fromCurrency]
    const result = usdAmount * input.rates[input.toCurrency]
    return { result }
  }
}
