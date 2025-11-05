import { Metadata } from "next"
import { UnitConversionTemplate } from "@/lib/categories/unit-conversions"
import { SidebarAd, FooterAd } from "@/components/ads/ad-unit"

export const metadata: Metadata = {
  title: "Miles to Kilometers Converter",
  description: "Convert distance from miles to kilometers instantly.",
  keywords: ["miles", "kilometers", "distance", "converter", "mi to km"],
}

const distanceUnits = [
  { value: "mile", label: "Miles", abbreviation: "mi" },
  { value: "km", label: "Kilometers", abbreviation: "km" },
  { value: "meter", label: "Meters", abbreviation: "m" },
  { value: "feet", label: "Feet", abbreviation: "ft" },
]

export default function MilesKmPage() {
  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <UnitConversionTemplate
            title="Miles to Kilometers Converter"
            description="Convert between miles, kilometers, and other distance units"
            units={distanceUnits}
            defaultFromUnit="mile"
            defaultToUnit="km"
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
