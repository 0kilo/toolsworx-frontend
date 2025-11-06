import { Metadata } from "next"
import { UnitConversionTemplate } from "@/lib/categories/unit-conversions"
import { SidebarAd, FooterAd } from "@/components/ads/ad-unit"
import { AboutDescription } from "@/components/ui/about-description"

export const metadata: Metadata = {
  title: "Kelvin to Celsius Converter",
  description: "Convert between Kelvin and Celsius for scientific calculations. Free temperature conversion tool.",
  keywords: ["kelvin", "celsius", "temperature", "converter", "k", "c", "scientific"],
}

const temperatureUnits = [
  { value: "kelvin", label: "Kelvin", abbreviation: "K" },
  { value: "celsius", label: "Celsius", abbreviation: "°C" },
  { value: "fahrenheit", label: "Fahrenheit", abbreviation: "°F" },
]

export default function KelvinCelsiusPage() {
  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <UnitConversionTemplate
            title="Kelvin - Celsius Converter"
            description="Convert between Kelvin and Celsius for scientific calculations"
            units={temperatureUnits}
            defaultFromUnit="kelvin"
            defaultToUnit="celsius"
            conversionType="temperature"
            placeholder="Enter temperature"
            resultLabel="Converted Temperature"
          />

          <FooterAd />

          <AboutDescription
            title="About Kelvin to Celsius Conversion"
            description="Converting between Kelvin and Celsius is essential for scientific calculations, physics, and chemistry work."
            sections={[
              {
                title: "Common Conversions",
                content: [
                  "0 K = -273.15°C (absolute zero)",
                  "273.15 K = 0°C (freezing point of water)",
                  "373.15 K = 100°C (boiling point of water)",
                  "293.15 K = 20°C (room temperature)",
                  "310.15 K = 37°C (body temperature)"
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