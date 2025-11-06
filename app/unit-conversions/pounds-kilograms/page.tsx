import { Metadata } from "next"
import { UnitConversionTemplate } from "@/lib/categories/unit-conversions"
import { SidebarAd, FooterAd } from "@/components/ads/ad-unit"
import { AboutDescription } from "@/components/ui/about-description"

export const metadata: Metadata = {
  title: "Pounds to Kilograms Converter",
  description: "Convert between pounds and kilograms accurately. Free weight conversion tool.",
  keywords: ["pounds", "kilograms", "weight", "converter", "lbs", "kg"],
}

const weightUnits = [
  { value: "pound", label: "Pounds", abbreviation: "lbs" },
  { value: "kg", label: "Kilograms", abbreviation: "kg" },
  { value: "ounce", label: "Ounces", abbreviation: "oz" },
  { value: "gram", label: "Grams", abbreviation: "g" },
  { value: "stone", label: "Stone", abbreviation: "st" },
]

export default function PoundsKilogramsPage() {
  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <UnitConversionTemplate
            title="Pounds - Kilograms Converter"
            description="Convert between pounds and kilograms accurately"
            units={weightUnits}
            defaultFromUnit="pound"
            defaultToUnit="kg"
            conversionType="weight"
            placeholder="Enter weight"
            resultLabel="Converted Weight"
          />

          <FooterAd />

          <AboutDescription
            title="About Pounds to Kilograms Conversion"
            description="Converting between pounds and kilograms is essential for fitness, cooking, and international weight measurements."
            sections={[
              {
                title: "Common Conversions",
                content: [
                  "1 pound = 0.453592 kilograms",
                  "1 kilogram = 2.20462 pounds",
                  "150 lbs = 68.04 kg (average weight)",
                  "100 lbs = 45.36 kg",
                  "200 lbs = 90.72 kg"
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