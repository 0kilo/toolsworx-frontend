/**
 * Pregnancy Calculator - Business Logic
 * 
 * Calculate due date and pregnancy timeline
 * MCP-compatible for AI agent integration
 * 
 * @module tools/logic/calculators/calculator-pregnancy
 */

export interface PregnancyInput {
  lastPeriod: string
}

export interface PregnancyOutput {
  dueDate: string
  weeksPregnant: string
  daysUntilDue: string
  trimester: string
}

export function validatePregnancyInput(input: PregnancyInput): string | null {
  if (!input.lastPeriod) {
    return "Last period date is required"
  }
  const date = new Date(input.lastPeriod)
  if (isNaN(date.getTime())) {
    return "Invalid date"
  }
  return null
}

export function calculatePregnancy(input: PregnancyInput): PregnancyOutput {
  const error = validatePregnancyInput(input)
  if (error) throw new Error(error)

  const lastPeriod = new Date(input.lastPeriod)
  const today = new Date()
  
  const dueDate = new Date(lastPeriod)
  dueDate.setDate(dueDate.getDate() + 280)
  
  const daysDiff = Math.floor((today.getTime() - lastPeriod.getTime()) / (1000 * 60 * 60 * 24))
  const weeks = Math.floor(daysDiff / 7)
  const days = daysDiff % 7
  
  const daysUntilDue = Math.floor((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  return {
    dueDate: dueDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    weeksPregnant: `${weeks} weeks, ${days} days`,
    daysUntilDue: daysUntilDue > 0 ? daysUntilDue.toString() : "Baby is due!",
    trimester: weeks < 13 ? "First" : weeks < 27 ? "Second" : "Third",
  }
}
