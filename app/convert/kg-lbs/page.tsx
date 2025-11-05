import { Metadata } from "next"
import { FormulaConverter } from "@/components/converters/formula-converter"
import { SidebarAd, FooterAd } from "@/components/ads/ad-unit"

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
          <FormulaConverter
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

          {/* SEO Content */}
          <div className="mt-8 prose prose-sm max-w-none">
            <h2>About Weight Conversion</h2>
            <p>
              Weight conversion is essential for fitness tracking, cooking, shipping, and international commerce.
              This tool provides instant conversions between kilograms, pounds, and other weight units.
            </p>

            <h3>Common Conversions</h3>
            <ul>
              <li>1 kg = 2.20462 pounds</li>
              <li>1 pound = 0.453592 kg</li>
              <li>1 kg = 1000 grams</li>
              <li>1 pound = 16 ounces</li>
            </ul>

            <h3>Quick Tips</h3>
            <ul>
              <li>To roughly convert kg to lbs, multiply by 2.2</li>
              <li>To roughly convert lbs to kg, divide by 2.2</li>
            </ul>

            <h3>Use Cases</h3>
            <ul>
              <li>Fitness and body weight tracking</li>
              <li>Recipe conversions</li>
              <li>Shipping and package weights</li>
              <li>Baggage weight limits</li>
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
