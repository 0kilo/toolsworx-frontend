/**
 * Timestamp Converter Logic
 * Pure functions for converting between Unix timestamps and dates
 */

export interface TimestampToDateInput {
  timestamp: number
}

export interface DateToTimestampInput {
  date: string
}

export interface TimestampToDateOutput {
  date: string
}

export interface DateToTimestampOutput {
  timestamp: number
}

export function timestampToDate(input: TimestampToDateInput): TimestampToDateOutput {
  const date = new Date(input.timestamp * 1000)
  return { date: date.toISOString() }
}

export function dateToTimestamp(input: DateToTimestampInput): DateToTimestampOutput {
  const date = new Date(input.date)
  const timestamp = Math.floor(date.getTime() / 1000)
  return { timestamp }
}

export function getCurrentTimestamp(): number {
  return Math.floor(Date.now() / 1000)
}
