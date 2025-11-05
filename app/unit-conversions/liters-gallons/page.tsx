import { Metadata } from "next"
import { UnitConversionTemplate } from "@/lib/categories/unit-conversions"
import { SidebarAd, FooterAd } from "@/components/ads/ad-unit"
import { AboutDescription } from "@/components/ui/about-description"

export const metadata: Metadata = {
  title: "Liters to Gallons Converter",
  description: "Convert volume from liters to gallons instantly.",
  keywords: ["liters", "gallons", "volume", "converter", "L to gal"],
}

const volumeUnits = [
  { value: "L", label: "Liters", abbreviation: "L" },
  { value: "gallon", label: "Gallons", abbreviation: "gal" },
  { value: "mL", label: "Milliliters", abbreviation: "mL" },
  { value: "cup", label: "Cups", abbreviation: "cup" },
  { value: "floz", label: "Fluid Ounces", abbreviation: "fl oz" },
]

export default function LitersGallonsPage() {
  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <UnitConversionTemplate
            title="Liters to Gallons Converter"
            description="Convert between liters, gallons, and other volume units"
            units={volumeUnits}
            defaultFromUnit="L"
            defaultToUnit="gallon"
            conversionType="volume"
          />
          <FooterAd />
          
          <AboutDescription
            title="About Volume Conversion"
            description="Volume conversion is essential for cooking, fuel calculations, and liquid measurements. This tool provides accurate conversions between metric and imperial volume units."
            sections={[
              {
                title: "Common Conversions",
                content: [
                  "1 liter = 0.264172 US gallons",
                  "1 US gallon = 3.78541 liters",
                  "1 liter = 1000 milliliters",
                  "1 gallon = 16 cups (US)"
                ]
              },
              {
                title: "Use Cases",
                content: [
                  "Recipe conversions between metric and imperial",
                  "Fuel efficiency calculations",
                  "Liquid storage and container sizing",
                  "International shipping and trade"
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
