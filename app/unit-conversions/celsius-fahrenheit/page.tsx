import { Metadata } from "next"
import { UnitConversionTemplate } from "@/lib/categories/unit-conversions"
import { SidebarAd, FooterAd } from "@/components/ads/ad-unit"
import { AboutDescription } from "@/components/ui/about-description"

export const metadata: Metadata = {
  title: "Celsius to Fahrenheit Converter",
  description: "Convert temperature between Celsius and Fahrenheit instantly. Free, fast, and accurate temperature conversion tool.",
  keywords: ["celsius", "fahrenheit", "temperature", "converter", "degrees", "c to f", "f to c"],
}

const temperatureUnits = [
  { value: "celsius", label: "Celsius", abbreviation: "°C" },
  { value: "fahrenheit", label: "Fahrenheit", abbreviation: "°F" },
  { value: "kelvin", label: "Kelvin", abbreviation: "K" },
]

export default function CelsiusFahrenheitPage() {
  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <UnitConversionTemplate
            title="Celsius to Fahrenheit Converter"
            description="Convert temperature between Celsius, Fahrenheit, and Kelvin"
            units={temperatureUnits}
            defaultFromUnit="celsius"
            defaultToUnit="fahrenheit"
            conversionType="temperature"
            placeholder="Enter temperature"
            resultLabel="Converted Temperature"
          />

          <FooterAd />

          <AboutDescription
            title="About Temperature Conversion"
            description="Temperature conversion is essential for many applications, from cooking to science. This tool helps you convert between Celsius, Fahrenheit, and Kelvin instantly."
            sections={[
              {
                title: "Common Conversions",
                content: [
                  "0°C = 32°F (Freezing point of water)",
                  "100°C = 212°F (Boiling point of water)",
                  "37°C = 98.6°F (Normal body temperature)",
                  "-40°C = -40°F (Where scales intersect)"
                ]
              },
              {
                title: "Conversion Formulas",
                content: [
                  "°F = (°C × 9/5) + 32",
                  "°C = (°F - 32) × 5/9",
                  "K = °C + 273.15"
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
