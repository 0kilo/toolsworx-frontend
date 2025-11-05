import { Metadata } from "next"
import { FormulaConverter } from "@/components/converters/formula-converter"
import { convertDistance } from "@/lib/converters/formula-converters"
import { SidebarAd, FooterAd } from "@/components/ads/ad-unit"

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
          <FormulaConverter
            title="Distance Converter"
            description="Convert between kilometers, miles, meters, feet, and more"
            units={distanceUnits}
            defaultFromUnit="km"
            defaultToUnit="mile"
            onConvert={convertDistance}
            placeholder="Enter distance"
            resultLabel="Converted Distance"
          />

          <FooterAd />

          {/* SEO Content */}
          <div className="mt-8 prose prose-sm max-w-none">
            <h2>About Distance Conversion</h2>
            <p>
              Converting between kilometers and miles is useful for travel, sports, and everyday measurements.
              This tool provides instant and accurate conversions.
            </p>

            <h3>Common Conversions</h3>
            <ul>
              <li>1 km = 0.621371 miles</li>
              <li>1 mile = 1.60934 km</li>
              <li>5 km = 3.10686 miles (common running distance)</li>
              <li>10 km = 6.21371 miles</li>
              <li>Marathon: 42.195 km = 26.219 miles</li>
            </ul>

            <h3>Quick Tips</h3>
            <ul>
              <li>To roughly convert km to miles, multiply by 0.6</li>
              <li>To roughly convert miles to km, multiply by 1.6</li>
            </ul>
          </div>
        </div>

        <div className="lg:col-span-1">
          <SidebarAd />
        </div>
      </div>
    </div>
  )
}
