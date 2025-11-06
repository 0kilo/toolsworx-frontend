import { Metadata } from "next"
import { UnitConversionTemplate } from "@/lib/categories/unit-conversions"
import { SidebarAd, FooterAd } from "@/components/ads/ad-unit"
import { AboutDescription } from "@/components/ui/about-description"

export const metadata: Metadata = {
  title: "Ounces to Grams Converter",
  description: "Convert between ounces and grams for cooking and measurements. Free weight conversion tool.",
  keywords: ["ounces", "grams", "weight", "converter", "oz", "g", "cooking"],
}

const weightUnits = [
  { value: "ounce", label: "Ounces", abbreviation: "oz" },
  { value: "gram", label: "Grams", abbreviation: "g" },
  { value: "pound", label: "Pounds", abbreviation: "lbs" },
  { value: "kg", label: "Kilograms", abbreviation: "kg" },
]

export default function OuncesGramsPage() {
  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <UnitConversionTemplate
            title="Ounces - Grams Converter"
            description="Convert between ounces and grams for cooking and measurements"
            units={weightUnits}
            defaultFromUnit="ounce"
            defaultToUnit="gram"
            conversionType="weight"
            placeholder="Enter weight"
            resultLabel="Converted Weight"
          />

          <FooterAd />

          <AboutDescription
            title="About Ounces to Grams Conversion"
            description="Converting between ounces and grams is essential for cooking, baking, and precise measurements in recipes."
            sections={[
              {
                title: "Common Conversions",
                content: [
                  "1 ounce = 28.3495 grams",
                  "1 gram = 0.035274 ounces",
                  "8 oz = 226.8 g (1 cup flour)",
                  "4 oz = 113.4 g (1/2 cup)",
                  "16 oz = 453.6 g (1 pound)"
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