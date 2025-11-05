import { Metadata } from "next"
import { FormulaConverter } from "@/components/converters/formula-converter"
import { convertTime } from "@/lib/converters/formula-converters"
import { SidebarAd, FooterAd } from "@/components/ads/ad-unit"

export const metadata: Metadata = {
  title: "Hours to Minutes Converter",
  description: "Convert time from hours to minutes instantly.",
  keywords: ["hours", "minutes", "time", "converter", "h to min"],
}

const timeUnits = [
  { value: "hour", label: "Hours", abbreviation: "h" },
  { value: "minute", label: "Minutes", abbreviation: "min" },
  { value: "second", label: "Seconds", abbreviation: "s" },
  { value: "day", label: "Days", abbreviation: "d" },
]

export default function HoursMinutesPage() {
  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <FormulaConverter
            title="Time Converter"
            description="Convert between hours, minutes, seconds, and days"
            units={timeUnits}
            defaultFromUnit="hour"
            defaultToUnit="minute"
            onConvert={convertTime}
          />
          <FooterAd />
        </div>
        <div className="lg:col-span-1">
          <SidebarAd />
        </div>
      </div>
    </div>
  )
}
