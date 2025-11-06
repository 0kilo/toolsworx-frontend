"use client"

import { UnitConverter } from "@/components/shared/unit-converter"
import { SidebarAd, FooterAd } from "@/components/ads/ad-unit"
import { AboutDescription } from "@/components/ui/about-description"
import { Square } from "lucide-react"

const areaUnits = [
  { value: "sqmm", label: "Square Millimeter", abbreviation: "mm²", factor: 0.000001 },
  { value: "sqcm", label: "Square Centimeter", abbreviation: "cm²", factor: 0.0001 },
  { value: "sqin", label: "Square Inch", abbreviation: "in²", factor: 0.00064516 },
  { value: "sqft", label: "Square Foot", abbreviation: "ft²", factor: 0.092903 },
  { value: "sqyd", label: "Square Yard", abbreviation: "yd²", factor: 0.836127 },
  { value: "sqm", label: "Square Meter", abbreviation: "m²", factor: 1 },
  { value: "acre", label: "Acre", abbreviation: "ac", factor: 4046.86 },
  { value: "hectare", label: "Hectare", abbreviation: "ha", factor: 10000 },
  { value: "sqkm", label: "Square Kilometer", abbreviation: "km²", factor: 1000000 },
  { value: "sqmi", label: "Square Mile", abbreviation: "mi²", factor: 2589988 },
]

export default function AreaConverterPage() {
  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Area Converter</h1>
            <p className="text-muted-foreground">
              Convert between different area and surface measurement units
            </p>
          </div>

          <UnitConverter
            title="Area & Surface Conversion"
            description="Convert between square meters, feet, acres, hectares, and more"
            units={areaUnits}
            baseUnit="sqm"
            icon={Square}
            defaultFromUnit="sqft"
            defaultToUnit="sqm"
          />

          <FooterAd />

          <AboutDescription
            title="About Area Conversion"
            description="Area conversion is essential for real estate, construction, agriculture, and land management across different measurement systems."
            sections={[
              {
                title: "Area Units",
                content: [
                  "Small: Square millimeter (mm²), Square centimeter (cm²), Square inch (in²)",
                  "Common: Square foot (ft²), Square yard (yd²), Square meter (m²)",
                  "Land: Acre (ac), Hectare (ha)",
                  "Large: Square kilometer (km²), Square mile (mi²)"
                ]
              },
              {
                title: "Conversion Examples",
                content: [
                  "1 square meter = 10.764 square feet = 1.196 square yards",
                  "1 acre = 4,047 square meters = 43,560 square feet",
                  "1 hectare = 10,000 square meters = 2.471 acres",
                  "1 square kilometer = 100 hectares = 247.1 acres = 0.386 square miles"
                ]
              },
              {
                title: "Use Cases",
                content: [
                  "Real estate property measurements",
                  "Construction and architectural planning",
                  "Agricultural land calculations",
                  "Interior design and flooring",
                  "Geographic and mapping applications"
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