"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarAd, FooterAd } from "@/components/ads/ad-unit"
import { AboutDescription } from "@/components/ui/about-description"
import { Calendar, Gift, Heart, Sparkles, PartyPopper, Clock } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface Holiday {
  name: string
  date: Date
  icon: any
  color: string
  emoji: string
}

interface TimeRemaining {
  days: number
  hours: number
  minutes: number
  seconds: number
  totalDays: number
  progress: number
}

export default function HolidayCountdownPage() {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const getHolidays = (): Holiday[] => {
    const year = currentTime.getFullYear()
    const nextYear = year + 1

    const holidays: Holiday[] = [
      {
        name: "Christmas",
        date: new Date(year, 11, 25), // December 25
        icon: Gift,
        color: "bg-red-50 border-red-200",
        emoji: "🎄"
      },
      {
        name: "New Year's Day",
        date: new Date(nextYear, 0, 1), // January 1
        icon: PartyPopper,
        color: "bg-purple-50 border-purple-200",
        emoji: "🎆"
      },
      {
        name: "Valentine's Day",
        date: new Date(nextYear, 1, 14), // February 14
        icon: Heart,
        color: "bg-pink-50 border-pink-200",
        emoji: "💝"
      },
      {
        name: "Easter",
        date: getEasterDate(nextYear),
        icon: Sparkles,
        color: "bg-yellow-50 border-yellow-200",
        emoji: "🐰"
      },
      {
        name: "Independence Day",
        date: new Date(nextYear, 6, 4), // July 4
        icon: PartyPopper,
        color: "bg-blue-50 border-blue-200",
        emoji: "🇺🇸"
      },
      {
        name: "Halloween",
        date: new Date(nextYear, 9, 31), // October 31
        icon: Sparkles,
        color: "bg-orange-50 border-orange-200",
        emoji: "🎃"
      },
      {
        name: "Thanksgiving",
        date: getThanksgivingDate(nextYear),
        icon: Gift,
        color: "bg-amber-50 border-amber-200",
        emoji: "🦃"
      },
    ]

    // Adjust dates if holiday has passed this year
    return holidays.map(holiday => {
      if (holiday.date < currentTime && holiday.name !== "New Year's Day") {
        return {
          ...holiday,
          date: new Date(holiday.date.setFullYear(nextYear))
        }
      }
      return holiday
    })
  }

  const getEasterDate = (year: number): Date => {
    // Computus algorithm for Easter (Western)
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

  const getThanksgivingDate = (year: number): Date => {
    // Fourth Thursday of November
    const november = new Date(year, 10, 1) // November 1
    const firstDay = november.getDay()
    const daysUntilThursday = (4 - firstDay + 7) % 7
    const firstThursday = 1 + daysUntilThursday
    const fourthThursday = firstThursday + 21
    return new Date(year, 10, fourthThursday)
  }

  const calculateTimeRemaining = (targetDate: Date): TimeRemaining => {
    const now = currentTime.getTime()
    const target = targetDate.getTime()
    const difference = target - now

    const days = Math.floor(difference / (1000 * 60 * 60 * 24))
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((difference % (1000 * 60)) / 1000)

    // Calculate year start for progress
    const yearStart = new Date(currentTime.getFullYear(), 0, 1)
    const yearProgress = (now - yearStart.getTime()) / (365 * 24 * 60 * 60 * 1000) * 100

    return {
      days,
      hours,
      minutes,
      seconds,
      totalDays: days,
      progress: yearProgress
    }
  }

  const holidays = getHolidays().sort((a, b) => a.date.getTime() - b.date.getTime())

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Holiday Countdown</h1>
            <p className="text-muted-foreground">
              Countdown to Christmas, New Year, and other major holidays
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Current Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-2xl font-bold">
                  {currentTime.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <p className="text-4xl font-bold mt-2 text-primary">
                  {currentTime.toLocaleTimeString('en-US')}
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 mb-8">
            {holidays.map((holiday, index) => {
              const timeRemaining = calculateTimeRemaining(holiday.date)
              const IconComponent = holiday.icon

              return (
                <Card key={index} className={`border-2 ${holiday.color}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <span className="text-3xl">{holiday.emoji}</span>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold">{holiday.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {holiday.date.toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-4 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-primary">
                          {timeRemaining.days}
                        </div>
                        <div className="text-xs text-muted-foreground uppercase">Days</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-primary">
                          {timeRemaining.hours}
                        </div>
                        <div className="text-xs text-muted-foreground uppercase">Hours</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-primary">
                          {timeRemaining.minutes}
                        </div>
                        <div className="text-xs text-muted-foreground uppercase">Minutes</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-primary">
                          {timeRemaining.seconds}
                        </div>
                        <div className="text-xs text-muted-foreground uppercase">Seconds</div>
                      </div>
                    </div>

                    {timeRemaining.totalDays > 0 && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Time until {holiday.name}</span>
                          <span className="font-semibold">
                            {timeRemaining.totalDays} {timeRemaining.totalDays === 1 ? 'day' : 'days'}
                          </span>
                        </div>
                        <Progress
                          value={Math.min(100, (365 - timeRemaining.totalDays) / 365 * 100)}
                          className="h-2"
                        />
                      </div>
                    )}

                    {timeRemaining.totalDays <= 7 && timeRemaining.totalDays > 0 && (
                      <div className="mt-4 p-3 bg-primary/10 rounded-lg text-center">
                        <p className="text-sm font-semibold text-primary">
                          🎉 {holiday.name} is less than a week away!
                        </p>
                      </div>
                    )}

                    {timeRemaining.totalDays === 0 && timeRemaining.days >= 0 && (
                      <div className="mt-4 p-3 bg-primary rounded-lg text-center">
                        <p className="text-sm font-bold text-white">
                          🎊 Happy {holiday.name}! 🎊
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <FooterAd />

          <AboutDescription
            title="About Holiday Countdown"
            description="Track the time until your favorite holidays with live countdowns. Perfect for planning celebrations, shopping, travel, and building excitement for upcoming special days."
            sections={[
              {
                title: "How It Works",
                content: "The countdown automatically updates every second, showing you exactly how many days, hours, minutes, and seconds remain until each major holiday. Holidays are sorted chronologically, so the next upcoming holiday appears first. The progress bar shows how far through the year we've progressed toward each celebration."
              },
              {
                title: "Featured Holidays",
                content: "We track major holidays including Christmas, New Year's Day, Valentine's Day, Easter, Independence Day, Halloween, and Thanksgiving. Easter and Thanksgiving dates are calculated automatically based on their traditional scheduling rules (Easter uses the Computus algorithm, Thanksgiving is the fourth Thursday of November)."
              },
              {
                title: "Holiday Planning Tips",
                content: "Use these countdowns to plan ahead! For Christmas, most people start shopping 6-8 weeks before. For travel, book flights 3-4 months in advance for best prices. For party planning, send invitations 3-4 weeks ahead. The one-week alerts help you remember last-minute preparations."
              },
              {
                title: "Shopping Deadlines",
                content: "Major retailers typically set shipping deadlines 1-2 weeks before holidays to guarantee delivery. For Christmas, expect cutoffs around December 18-20 for standard shipping, later for express. Black Friday (day after Thanksgiving) and Cyber Monday are prime shopping days with significant discounts."
              },
              {
                title: "Making the Most of Holidays",
                content: "Holidays are more enjoyable with proper planning. Create shopping lists early, budget for gifts and celebrations, book travel and accommodations well in advance, and consider starting traditions that make each holiday special for your family and friends. The anticipation is part of the fun!"
              },
            ]}
          />
        </div>

        <div className="lg:col-span-1">
          <SidebarAd />
        </div>
      </div>
    </div>
  )
}
