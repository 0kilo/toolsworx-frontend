/**
 * Date-Time Calculator Logic
 * Functions for date calculations, calendar display, and date differences
 */

export interface DateResult {
  date: Date
  dayName: string
  formatted: string
  iso: string
}

export interface DateDifferenceResult {
  totalDays: number
  weeksAndDays: {
    weeks: number
    days: number
  }
  monthsAndDays: {
    months: number
    weeks: number
    days: number
  }
  years: number
  hours: number
  minutes: number
  seconds: number
}

export interface AddDurationResult {
  resultDate: Date
  dayName: string
  formatted: string
  iso: string
  totalDaysAdded: number
}

export interface DurationEntry {
  id: string
  amount: number
  unit: 'days' | 'weeks' | 'months' | 'years'
}

/**
 * Add multiple durations to a date
 */
export function addMultipleDurations(
  dateString: string,
  durations: DurationEntry[]
): AddDurationResult | null {
  const date = parseDate(dateString)
  if (!date || durations.length === 0) return null
  
  const resultDate = new Date(date)
  let totalDays = 0
  
  // Apply each duration in order
  for (const duration of durations) {
    switch (duration.unit) {
      case 'days':
        resultDate.setDate(resultDate.getDate() + duration.amount)
        totalDays += duration.amount
        break
      case 'weeks':
        resultDate.setDate(resultDate.getDate() + (duration.amount * 7))
        totalDays += duration.amount * 7
        break
      case 'months':
        resultDate.setMonth(resultDate.getMonth() + duration.amount)
        break
      case 'years':
        resultDate.setFullYear(resultDate.getFullYear() + duration.amount)
        break
    }
  }
  
  return {
    resultDate,
    dayName: getDayName(resultDate),
    formatted: formatDate(resultDate),
    iso: resultDate.toISOString().split('T')[0],
    totalDaysAdded: totalDays
  }
}

/**
 * Get the day name for a given date
 */
export function getDayName(date: Date): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  return days[date.getDay()]
}

/**
 * Format date for display
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * Parse a date string to a Date object (handles YYYY-MM-DD format)
 */
export function parseDate(dateString: string): Date | null {
  if (!dateString) return null
  
  // Parse YYYY-MM-DD format
  const parts = dateString.split('-')
  if (parts.length !== 3) return null
  
  const year = parseInt(parts[0], 10)
  const month = parseInt(parts[1], 10) - 1 // JavaScript months are 0-indexed
  const day = parseInt(parts[2], 10)
  
  const date = new Date(year, month, day)
  
  // Validate the date
  if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
    return null
  }
  
  return date
}

/**
 * Given a date, return detailed date information
 */
export function getDateInfo(dateString: string): DateResult | null {
  const date = parseDate(dateString)
  if (!date) return null
  
  return {
    date,
    dayName: getDayName(date),
    formatted: formatDate(date),
    iso: date.toISOString().split('T')[0]
  }
}

/**
 * Add days, weeks, or months to a date
 */
export function addDuration(
  dateString: string,
  amount: number,
  unit: 'days' | 'weeks' | 'months'
): AddDurationResult | null {
  const date = parseDate(dateString)
  if (!date) return null
  
  const resultDate = new Date(date)
  let totalDays = 0
  
  switch (unit) {
    case 'days':
      resultDate.setDate(resultDate.getDate() + amount)
      totalDays = amount
      break
    case 'weeks':
      resultDate.setDate(resultDate.getDate() + (amount * 7))
      totalDays = amount * 7
      break
    case 'months':
      resultDate.setMonth(resultDate.getMonth() + amount)
      // Handle edge case: adding months to Jan 31 might give Feb 31 which doesn't exist
      // JavaScript automatically adjusts to Mar 3 or Feb 28/29
      break
  }
  
  return {
    resultDate,
    dayName: getDayName(resultDate),
    formatted: formatDate(resultDate),
    iso: resultDate.toISOString().split('T')[0],
    totalDaysAdded: totalDays
  }
}

/**
 * Calculate the difference between two dates
 */
export function calculateDateDifference(startDateStr: string, endDateStr: string): DateDifferenceResult | null {
  const startDate = parseDate(startDateStr)
  const endDate = parseDate(endDateStr)
  
  if (!startDate || !endDate) return null
  
  // Ensure startDate is before endDate for calculation
  const earlierDate = startDate < endDate ? startDate : endDate
  const laterDate = startDate < endDate ? endDate : startDate
  
  // Calculate total milliseconds difference
  const msPerDay = 24 * 60 * 60 * 1000
  const totalMs = laterDate.getTime() - earlierDate.getTime()
  const totalDays = Math.floor(totalMs / msPerDay)
  
  // Calculate weeks and remaining days
  const weeks = Math.floor(totalDays / 7)
  const remainingDays = totalDays % 7
  
  // Calculate months, weeks, and days
  let months = 0
  let tempDate = new Date(earlierDate)
  
  // Count full months
  while (true) {
    const nextMonth = new Date(tempDate)
    nextMonth.setMonth(nextMonth.getMonth() + 1)
    
    if (nextMonth > laterDate) break
    
    months++
    tempDate = nextMonth
  }
  
  // Calculate remaining days after months
  const afterMonthsDate = new Date(earlierDate)
  afterMonthsDate.setMonth(afterMonthsDate.getMonth() + months)
  
  const remainingMs = laterDate.getTime() - afterMonthsDate.getTime()
  const remainingDaysAfterMonths = Math.floor(remainingMs / msPerDay)
  const remainingWeeks = Math.floor(remainingDaysAfterMonths / 7)
  const finalDays = remainingDaysAfterMonths % 7
  
  // Calculate years
  const years = Math.floor(months / 12)
  const remainingMonths = months % 12
  
  // Calculate hours, minutes, seconds (for exact time difference)
  const hours = Math.floor(totalMs / (1000 * 60 * 60))
  const minutes = Math.floor(totalMs / (1000 * 60))
  const seconds = Math.floor(totalMs / 1000)
  
  return {
    totalDays,
    weeksAndDays: {
      weeks,
      days: remainingDays
    },
    monthsAndDays: {
      months: remainingMonths,
      weeks: remainingWeeks,
      days: finalDays
    },
    years,
    hours,
    minutes,
    seconds
  }
}

/**
 * Helper function to calculate months difference
 */
function calculateMonthsDifference(start: Date, end: Date): number {
  const months = (end.getFullYear() - start.getFullYear()) * 12
  return months + (end.getMonth() - start.getMonth())
}

/**
 * Get calendar data for a specific month
 */
export function getCalendarData(year: number, month: number): CalendarData {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startDayOfWeek = firstDay.getDay() // 0 = Sunday, 6 = Saturday
  
  // Get days from previous month to fill the grid
  const prevMonthLastDay = new Date(year, month, 0)
  const daysFromPrevMonth = startDayOfWeek
  
  // Build calendar grid
  const weeks: (CalendarDay | null)[][] = []
  let currentWeek: (CalendarDay | null)[] = []
  
  // Fill in nulls for days before the first day of the month
  for (let i = 0; i < startDayOfWeek; i++) {
    const dayNum = prevMonthLastDay.getDate() - startDayOfWeek + i + 1
    const date = new Date(year, month - 1, dayNum)
    currentWeek.push({
      day: dayNum,
      date,
      isCurrentMonth: false,
      isToday: isToday(date)
    })
  }
  
  // Fill in days of current month
  for (let day = 1; day <= lastDay.getDate(); day++) {
    const date = new Date(year, month, day)
    currentWeek.push({
      day,
      date,
      isCurrentMonth: true,
      isToday: isToday(date)
    })
    
    if (currentWeek.length === 7) {
      weeks.push(currentWeek)
      currentWeek = []
    }
  }
  
  // Fill in remaining days from next month
  const nextMonthDay = 1
  while (currentWeek.length < 7 && currentWeek.length > 0) {
    const date = new Date(year, month + 1, currentWeek.length - (7 - lastDay.getDate()) + startDayOfWeek)
    currentWeek.push({
      day: date.getDate(),
      date,
      isCurrentMonth: false,
      isToday: isToday(date)
    })
  }
  
  if (currentWeek.length > 0) {
    weeks.push(currentWeek)
  }
  
  return {
    year,
    month,
    monthName: firstDay.toLocaleDateString('en-US', { month: 'long' }),
    weeks,
    today: new Date()
  }
}

export interface CalendarDay {
  day: number
  date: Date
  isCurrentMonth: boolean
  isToday: boolean
}

export interface CalendarData {
  year: number
  month: number
  monthName: string
  weeks: (CalendarDay | null)[][]
  today: Date
}

function isToday(date: Date): boolean {
  const today = new Date()
  return date.getDate() === today.getDate() &&
         date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear()
}
