import { Metadata } from "next"
import { FormulaConverter } from "@/components/converters/formula-converter"
import { convertVolume } from "@/lib/converters/formula-converters"
import { SidebarAd, FooterAd } from "@/components/ads/ad-unit"

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
          <FormulaConverter
            title="Liters to Gallons Converter"
            description="Convert between liters, gallons, and other volume units"
            units={volumeUnits}
            defaultFromUnit="L"
            defaultToUnit="gallon"
            onConvert={convertVolume}
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
