import { Metadata } from "next"
import { UnitConversionTemplate } from "@/lib/categories/unit-conversions"
import { SidebarAd, FooterAd } from "@/components/ads/ad-unit"

export const metadata: Metadata = {
  title: "Pounds to Kilograms Converter",
  description: "Convert weight from pounds to kilograms instantly.",
  keywords: ["pounds", "kilograms", "weight", "converter", "lbs to kg"],
}

const weightUnits = [
  { value: "lb", label: "Pounds", abbreviation: "lbs" },
  { value: "kg", label: "Kilograms", abbreviation: "kg" },
  { value: "g", label: "Grams", abbreviation: "g" },
  { value: "oz", label: "Ounces", abbreviation: "oz" },
]

export default function LbsKgPage() {
  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <UnitConversionTemplate
            title="Pounds to Kilograms Converter"
            description="Convert between pounds, kilograms, and other weight units"
            units={weightUnits}
            defaultFromUnit="lb"
            defaultToUnit="kg"
            conversionType="weight"
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
