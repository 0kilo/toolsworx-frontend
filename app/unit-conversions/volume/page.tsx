"use client"

import { UnitConverter } from "@/components/shared/unit-converter"
import { SidebarAd, FooterAd } from "@/components/ads/ad-unit"
import { AboutDescription } from "@/components/ui/about-description"
import { Droplet } from "lucide-react"

const volumeUnits = [
  { value: "milliliter", label: "Milliliter", abbreviation: "ml", factor: 0.001 },
  { value: "fluid-ounce", label: "Fluid Ounce (US)", abbreviation: "fl oz", factor: 0.0295735 },
  { value: "cup", label: "Cup (US)", abbreviation: "cup", factor: 0.236588 },
  { value: "pint", label: "Pint (US)", abbreviation: "pt", factor: 0.473176 },
  { value: "quart", label: "Quart (US)", abbreviation: "qt", factor: 0.946353 },
  { value: "liter", label: "Liter", abbreviation: "L", factor: 1 },
  { value: "gallon", label: "Gallon (US)", abbreviation: "gal", factor: 3.78541 },
  { value: "imperial-gallon", label: "Imperial Gallon", abbreviation: "imp gal", factor: 4.54609 },
  { value: "cubic-meter", label: "Cubic Meter", abbreviation: "m³", factor: 1000 },
  { value: "barrel", label: "Barrel (Oil)", abbreviation: "bbl", factor: 158.987 },
]

export default function VolumeConverterPage() {
  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Volume Converter</h1>
            <p className="text-muted-foreground">
              Convert between different volume and liquid measurement units
            </p>
          </div>

          <UnitConverter
            title="Volume & Liquid Conversion"
            description="Convert between milliliters, cups, pints, liters, gallons and more"
            units={volumeUnits}
            baseUnit="liter"
            icon={Droplet}
            defaultFromUnit="liter"
            defaultToUnit="gallon"
          />

          <FooterAd />

          <AboutDescription
            title="About Volume Conversion"
            description="Volume conversion is essential for cooking, chemistry, fuel calculations, and liquid measurements across different systems."
            sections={[
              {
                title: "Common Volume Units",
                content: [
                  "Metric: Milliliter (ml), Liter (L), Cubic Meter (m³)",
                  "US Customary: Fluid Ounce, Cup, Pint, Quart, Gallon",
                  "Imperial: Imperial Gallon (larger than US gallon)",
                  "Industrial: Barrel (oil industry standard)"
                ]
              },
              {
                title: "Conversion Examples",
                content: [
                  "1 liter = 1000 milliliters = 33.814 fluid ounces (US)",
                  "1 gallon (US) = 3.78541 liters = 4 quarts = 8 pints",
                  "1 cup (US) = 236.588 milliliters = 8 fluid ounces",
                  "1 imperial gallon = 4.54609 liters = 1.20095 US gallons"
                ]
              },
              {
                title: "Use Cases",
                content: [
                  "Cooking and baking recipe conversions",
                  "Fuel consumption and efficiency calculations",
                  "Chemical and pharmaceutical measurements",
                  "Beverage industry and bartending",
                  "Swimming pool and tank capacity calculations"
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