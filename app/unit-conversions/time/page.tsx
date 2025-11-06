"use client"

import { UnitConverter } from "@/components/shared/unit-converter"
import { SidebarAd, FooterAd } from "@/components/ads/ad-unit"
import { AboutDescription } from "@/components/ui/about-description"
import { Clock } from "lucide-react"

const timeUnits = [
  { value: "nanosecond", label: "Nanosecond", abbreviation: "ns", factor: 0.000000001 },
  { value: "microsecond", label: "Microsecond", abbreviation: "μs", factor: 0.000001 },
  { value: "millisecond", label: "Millisecond", abbreviation: "ms", factor: 0.001 },
  { value: "second", label: "Second", abbreviation: "s", factor: 1 },
  { value: "minute", label: "Minute", abbreviation: "min", factor: 60 },
  { value: "hour", label: "Hour", abbreviation: "h", factor: 3600 },
  { value: "day", label: "Day", abbreviation: "d", factor: 86400 },
  { value: "week", label: "Week", abbreviation: "wk", factor: 604800 },
  { value: "month", label: "Month (30 days)", abbreviation: "mo", factor: 2592000 },
  { value: "year", label: "Year (365 days)", abbreviation: "yr", factor: 31536000 },
]

export default function TimeConverterPage() {
  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Time Converter</h1>
            <p className="text-muted-foreground">
              Convert between different time units from nanoseconds to years
            </p>
          </div>

          <UnitConverter
            title="Time Duration Conversion"
            description="Convert between nanoseconds, milliseconds, seconds, minutes, hours, days, weeks, months, and years"
            units={timeUnits}
            baseUnit="second"
            icon={Clock}
            defaultFromUnit="hour"
            defaultToUnit="second"
          />

          <FooterAd />

          <AboutDescription
            title="About Time Conversion"
            description="Time conversion is essential for programming, scientific calculations, project planning, and everyday time management."
            sections={[
              {
                title: "Time Units",
                content: [
                  "Precise: Nanosecond (ns), Microsecond (μs), Millisecond (ms), Second (s)",
                  "Common: Minute (min), Hour (h), Day (d), Week (wk)",
                  "Extended: Month (30 days), Year (365 days)",
                  "Scientific applications often use precise units"
                ]
              },
              {
                title: "Conversion Examples",
                content: [
                  "1 hour = 3,600 seconds = 60 minutes",
                  "1 day = 24 hours = 1,440 minutes = 86,400 seconds",
                  "1 week = 7 days = 168 hours = 604,800 seconds",
                  "1 year = 365 days = 8,760 hours = 31,536,000 seconds"
                ]
              },
              {
                title: "Use Cases",
                content: [
                  "Programming timeouts and delays",
                  "Scientific experiment timing",
                  "Project management and scheduling",
                  "Performance benchmarking",
                  "Age calculations and time spans"
                ]
              }
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