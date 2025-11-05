import { Metadata } from "next"
import { FormulaConverter } from "@/components/converters/formula-converter"
import { SidebarAd, FooterAd } from "@/components/ads/ad-unit"

export const metadata: Metadata = {
  title: "Feet to Meters Converter",
  description: "Convert distance from feet to meters instantly.",
  keywords: ["feet", "meters", "distance", "converter", "ft to m"],
}

const distanceUnits = [
  { value: "feet", label: "Feet", abbreviation: "ft" },
  { value: "meter", label: "Meters", abbreviation: "m" },
  { value: "inch", label: "Inches", abbreviation: "in" },
  { value: "cm", label: "Centimeters", abbreviation: "cm" },
  { value: "yard", label: "Yards", abbreviation: "yd" },
]

export default function FeetMetersPage() {
  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <FormulaConverter
            title="Feet to Meters Converter"
            description="Convert between feet, meters, and other distance units"
            units={distanceUnits}
            defaultFromUnit="feet"
            defaultToUnit="meter"
            conversionType="distance"
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
