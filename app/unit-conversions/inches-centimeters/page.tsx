import { Metadata } from "next"
import { UnitConversionTemplate } from "@/lib/categories/unit-conversions"
import { SidebarAd, FooterAd } from "@/components/ads/ad-unit"
import { AboutDescription } from "@/components/ui/about-description"

export const metadata: Metadata = {
  title: "Inches to Centimeters Converter",
  description: "Convert between inches and centimeters instantly. Free and accurate length conversion tool.",
  keywords: ["inches", "centimeters", "length", "converter", "in", "cm"],
}

const lengthUnits = [
  { value: "inch", label: "Inches", abbreviation: "in" },
  { value: "cm", label: "Centimeters", abbreviation: "cm" },
  { value: "feet", label: "Feet", abbreviation: "ft" },
  { value: "meter", label: "Meters", abbreviation: "m" },
  { value: "mm", label: "Millimeters", abbreviation: "mm" },
]

export default function InchesCentimetersPage() {
  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <UnitConversionTemplate
            title="Inches - Centimeters Converter"
            description="Convert between inches and centimeters instantly"
            units={lengthUnits}
            defaultFromUnit="inch"
            defaultToUnit="cm"
            conversionType="distance"
            placeholder="Enter length"
            resultLabel="Converted Length"
          />

          <FooterAd />

          <AboutDescription
            title="About Inches to Centimeters Conversion"
            description="Converting between inches and centimeters is essential for international measurements, crafts, and technical specifications."
            sections={[
              {
                title: "Common Conversions",
                content: [
                  "1 inch = 2.54 centimeters",
                  "1 centimeter = 0.393701 inches",
                  "12 inches = 30.48 cm (1 foot)",
                  "6 inches = 15.24 cm",
                  "24 inches = 60.96 cm"
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