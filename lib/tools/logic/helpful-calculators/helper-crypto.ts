/**
 * Crypto Converter Logic
 * Pure functions for cryptocurrency conversion calculations
 */

export interface CryptoConvertInput {
  amount: number
  fromCrypto: string
  toCurrency: string
  cryptoPrice: number
}

export interface CryptoConvertOutput {
  result: number
}

export function convertCrypto(input: CryptoConvertInput): CryptoConvertOutput {
  const cryptoInUSD = input.amount * input.cryptoPrice
  return { result: cryptoInUSD }
}
