/**
 * Holiday Countdown Logic
 * Pure functions for calculating time until holidays
 */

export interface TimeRemaining {
  days: number
  hours: number
  minutes: number
  seconds: number
  totalDays: number
  progress: number
}

export function calculateTimeRemaining(targetDate: Date, currentTime: Date): TimeRemaining {
  const now = currentTime.getTime()
  const target = targetDate.getTime()
  const difference = target - now

  const days = Math.floor(difference / (1000 * 60 * 60 * 24))
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((difference % (1000 * 60)) / 1000)

  const yearStart = new Date(currentTime.getFullYear(), 0, 1)
  const yearProgress = (now - yearStart.getTime()) / (365 * 24 * 60 * 60 * 1000) * 100

  return { days, hours, minutes, seconds, totalDays: days, progress: yearProgress }
}

export function getEasterDate(year: number): Date {
  const a = year % 19
  const b = Math.floor(year / 100)
  const c = year % 100
  const d = Math.floor(b / 4)
  const e = b % 4
  const f = Math.floor((b + 8) / 25)
  const g = Math.floor((b - f + 1) / 3)
  const h = (19 * a + b - d - g + 15) % 30
  const i = Math.floor(c / 4)
  const k = c % 4
  const l = (32 + 2 * e + 2 * i - h - k) % 7
  const m = Math.floor((a + 11 * h + 22 * l) / 451)
  const month = Math.floor((h + l - 7 * m + 114) / 31) - 1
  const day = ((h + l - 7 * m + 114) % 31) + 1
  return new Date(year, month, day)
}

export function getThanksgivingDate(year: number): Date {
  const november = new Date(year, 10, 1)
  const firstDay = november.getDay()
  const daysUntilThursday = (4 - firstDay + 7) % 7
  const firstThursday = 1 + daysUntilThursday
  const fourthThursday = firstThursday + 21
  return new Date(year, 10, fourthThursday)
}
