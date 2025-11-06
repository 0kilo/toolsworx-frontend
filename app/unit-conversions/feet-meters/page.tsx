import { Metadata } from "next"
import { UnitConversionTemplate } from "@/lib/categories/unit-conversions"
import { SidebarAd, FooterAd } from "@/components/ads/ad-unit"
import { AboutDescription } from "@/components/ui/about-description"

export const metadata: Metadata = {
  title: "Feet to Meters Converter",
  description: "Convert between feet and meters instantly. Free and accurate length conversion tool.",
  keywords: ["feet", "meters", "length", "converter", "ft", "m", "feet to meters"],
}

const lengthUnits = [
  { value: "feet", label: "Feet", abbreviation: "ft" },
  { value: "meter", label: "Meters", abbreviation: "m" },
  { value: "inch", label: "Inches", abbreviation: "in" },
  { value: "cm", label: "Centimeters", abbreviation: "cm" },
  { value: "yard", label: "Yards", abbreviation: "yd" },
  { value: "km", label: "Kilometers", abbreviation: "km" },
]

export default function KmMilesPage() {
  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <UnitConversionTemplate
            title="Feet - Meters Converter"
            description="Convert between feet and meters with precision"
            units={lengthUnits}
            defaultFromUnit="feet"
            defaultToUnit="meter"
            conversionType="distance"
            placeholder="Enter length"
            resultLabel="Converted Length"
          />

          <FooterAd />

          <AboutDescription
            title="About Feet to Meters Conversion"
            description="Converting between feet and meters is essential for construction, engineering, and international measurements. This tool provides instant and accurate conversions."
            sections={[
              {
                title: "Common Conversions",
                content: [
                  "1 foot = 0.3048 meters",
                  "1 meter = 3.28084 feet",
                  "6 feet = 1.8288 meters (average height)",
                  "10 feet = 3.048 meters",
                  "100 feet = 30.48 meters"
                ]
              },
              {
                title: "Quick Tips",
                content: [
                  "To roughly convert feet to meters, multiply by 0.3",
                  "To roughly convert meters to feet, multiply by 3.3"
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
