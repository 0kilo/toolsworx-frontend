"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AboutDescription } from "@/components/ui/about-description"
import { Calendar, Gift, Heart, Sparkles, PartyPopper, Clock } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { calculateTimeRemaining, getEasterDate, getThanksgivingDate, type TimeRemaining } from "@/lib/tools/logic/helpful-calculators/helper-holiday"
import toolContent from "./holiday-countdown.json"

interface Holiday {
  name: string
  date: Date
  icon: any
  color: string
  emoji: string
}



export default function HolidaycountdownClient() {
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



  const holidays = getHolidays().sort((a, b) => a.date.getTime() - b.date.getTime())

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">{toolContent.pageTitle}</h1>
            <p className="text-muted-foreground">
              {toolContent.pageDescription}
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
              const timeRemaining = calculateTimeRemaining(holiday.date, currentTime)
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


          <AboutDescription
            title={toolContent.aboutTitle}
            description={toolContent.aboutDescription}
            sections={toolContent.sections}
          />
        </div>

        <div className="lg:col-span-1">
        </div>
      </div>
    </div>
  )
}
