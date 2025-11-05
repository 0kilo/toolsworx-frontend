import { Metadata } from "next"
import { UnitConversionTemplate } from "@/lib/categories/unit-conversions"
import { SidebarAd, FooterAd } from "@/components/ads/ad-unit"
import { AboutDescription } from "@/components/ui/about-description"

export const metadata: Metadata = {
  title: "Kilograms to Pounds Converter",
  description: "Convert weight between kilograms and pounds instantly. Free and accurate weight conversion tool.",
  keywords: ["kilograms", "pounds", "weight", "converter", "kg", "lbs", "kg to lbs"],
}

const weightUnits = [
  { value: "kg", label: "Kilograms", abbreviation: "kg" },
  { value: "lb", label: "Pounds", abbreviation: "lbs" },
  { value: "g", label: "Grams", abbreviation: "g" },
  { value: "oz", label: "Ounces", abbreviation: "oz" },
  { value: "ton", label: "Tons", abbreviation: "t" },
]

export default function KgLbsPage() {
  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <UnitConversionTemplate
            title="Weight Converter"
            description="Convert between kilograms, pounds, grams, ounces, and more"
            units={weightUnits}
            defaultFromUnit="kg"
            defaultToUnit="lb"
            conversionType="weight"
            placeholder="Enter weight"
            resultLabel="Converted Weight"
          />

          <FooterAd />

          <AboutDescription
            title="About Weight Conversion"
            description="Weight conversion is essential for fitness tracking, cooking, shipping, and international commerce. This tool provides instant conversions between kilograms, pounds, and other weight units."
            sections={[
              {
                title: "Common Conversions",
                content: [
                  "1 kg = 2.20462 pounds",
                  "1 pound = 0.453592 kg",
                  "1 kg = 1000 grams",
                  "1 pound = 16 ounces"
                ]
              },
              {
                title: "Quick Tips & Use Cases",
                type: "subsections",
                content: [
                  {
                    title: "Quick Tips",
                    items: [
                      "To roughly convert kg to lbs, multiply by 2.2",
                      "To roughly convert lbs to kg, divide by 2.2"
                    ]
                  },
                  {
                    title: "Use Cases",
                    items: [
                      "Fitness and body weight tracking",
                      "Recipe conversions",
                      "Shipping and package weights",
                      "Baggage weight limits"
                    ]
                  }
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
