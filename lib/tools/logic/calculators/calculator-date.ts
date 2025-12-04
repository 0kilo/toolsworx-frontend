/**
 * Date Calculator - Business Logic
 * 
 * Calculate date differences and add time periods
 * MCP-compatible for AI agent integration
 * 
 * @module tools/logic/calculators/calculator-date
 */

export interface DateInput {
  startDate: string
  endDate?: string
  addDays?: number
  addMonths?: number
  addYears?: number
}

export interface DateOutput {
  daysBetween?: number
  weeksBetween?: number
  monthsBetween?: number
  yearsBetween?: number
  newDate?: string
  dayOfWeek?: string
  age?: string
}

export function validateDateInput(input: DateInput): string | null {
  if (!input.startDate) {
    return "Start date is required"
  }
  const startDate = new Date(input.startDate)
  if (isNaN(startDate.getTime())) {
    return "Invalid start date"
  }
  if (input.endDate) {
    const endDate = new Date(input.endDate)
    if (isNaN(endDate.getTime())) {
      return "Invalid end date"
    }
  }
  return null
}

export function calculateDate(input: DateInput): DateOutput {
  const error = validateDateInput(input)
  if (error) throw new Error(error)

  const startDate = new Date(input.startDate)
  const endDate = input.endDate ? new Date(input.endDate) : new Date()
  const output: DateOutput = {}

  // Calculate difference
  const timeDiff = endDate.getTime() - startDate.getTime()
  const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24))
  const weeksDiff = Math.floor(daysDiff / 7)
  const monthsDiff = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                    (endDate.getMonth() - startDate.getMonth())
  const yearsDiff = endDate.getFullYear() - startDate.getFullYear()

  output.daysBetween = daysDiff
  output.weeksBetween = weeksDiff
  output.monthsBetween = monthsDiff
  output.yearsBetween = yearsDiff

  // Calculate new date if adding time
  const addDays = input.addDays || 0
  const addMonths = input.addMonths || 0
  const addYears = input.addYears || 0

  if (addDays || addMonths || addYears) {
    const newDate = new Date(startDate)
    if (addYears) newDate.setFullYear(newDate.getFullYear() + addYears)
    if (addMonths) newDate.setMonth(newDate.getMonth() + addMonths)
    if (addDays) newDate.setDate(newDate.getDate() + addDays)

    output.newDate = newDate.toLocaleDateString()
    output.dayOfWeek = newDate.toLocaleDateString('en-US', { weekday: 'long' })
  }

  // Age calculation if end date is today
  if (!input.endDate) {
    const today = new Date()
    let age = today.getFullYear() - startDate.getFullYear()
    const monthDiff = today.getMonth() - startDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < startDate.getDate())) {
      age--
    }
    output.age = `${age} years old`
  }

  return output
}
