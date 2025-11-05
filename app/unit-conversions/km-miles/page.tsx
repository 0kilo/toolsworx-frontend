import { Metadata } from "next"
import { UnitConversionTemplate } from "@/lib/categories/unit-conversions"
import { SidebarAd, FooterAd } from "@/components/ads/ad-unit"
import { AboutDescription } from "@/components/ui/about-description"

export const metadata: Metadata = {
  title: "Kilometers to Miles Converter",
  description: "Convert distance between kilometers and miles instantly. Free and accurate distance conversion tool.",
  keywords: ["kilometers", "miles", "distance", "converter", "km", "mi", "km to miles"],
}

const distanceUnits = [
  { value: "km", label: "Kilometers", abbreviation: "km" },
  { value: "mile", label: "Miles", abbreviation: "mi" },
  { value: "meter", label: "Meters", abbreviation: "m" },
  { value: "feet", label: "Feet", abbreviation: "ft" },
  { value: "inch", label: "Inches", abbreviation: "in" },
  { value: "yard", label: "Yards", abbreviation: "yd" },
]

export default function KmMilesPage() {
  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <UnitConversionTemplate
            title="Distance Converter"
            description="Convert between kilometers, miles, meters, feet, and more"
            units={distanceUnits}
            defaultFromUnit="km"
            defaultToUnit="mile"
            conversionType="distance"
            placeholder="Enter distance"
            resultLabel="Converted Distance"
          />

          <FooterAd />

          <AboutDescription
            title="About Distance Conversion"
            description="Converting between kilometers and miles is useful for travel, sports, and everyday measurements. This tool provides instant and accurate conversions."
            sections={[
              {
                title: "Common Conversions",
                content: [
                  "1 km = 0.621371 miles",
                  "1 mile = 1.60934 km",
                  "5 km = 3.10686 miles (common running distance)",
                  "10 km = 6.21371 miles",
                  "Marathon: 42.195 km = 26.219 miles"
                ]
              },
              {
                title: "Quick Tips",
                content: [
                  "To roughly convert km to miles, multiply by 0.6",
                  "To roughly convert miles to km, multiply by 1.6"
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
