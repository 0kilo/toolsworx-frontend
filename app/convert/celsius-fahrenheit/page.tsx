import { Metadata } from "next"
import { FormulaConverter } from "@/components/converters/formula-converter"
import { convertTemperature } from "@/lib/converters/formula-converters"
import { SidebarAd, FooterAd } from "@/components/ads/ad-unit"

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
          <FormulaConverter
            title="Celsius to Fahrenheit Converter"
            description="Convert temperature between Celsius, Fahrenheit, and Kelvin"
            units={temperatureUnits}
            defaultFromUnit="celsius"
            defaultToUnit="fahrenheit"
            onConvert={convertTemperature}
            placeholder="Enter temperature"
            resultLabel="Converted Temperature"
          />

          <FooterAd />

          {/* SEO Content */}
          <div className="mt-8 prose prose-sm max-w-none">
            <h2>About Temperature Conversion</h2>
            <p>
              Temperature conversion is essential for many applications, from cooking to science.
              This tool helps you convert between Celsius, Fahrenheit, and Kelvin instantly.
            </p>

            <h3>Common Conversions</h3>
            <ul>
              <li>0°C = 32°F (Freezing point of water)</li>
              <li>100°C = 212°F (Boiling point of water)</li>
              <li>37°C = 98.6°F (Normal body temperature)</li>
              <li>-40°C = -40°F (Where scales intersect)</li>
            </ul>

            <h3>Conversion Formulas</h3>
            <ul>
              <li>°F = (°C × 9/5) + 32</li>
              <li>°C = (°F - 32) × 5/9</li>
              <li>K = °C + 273.15</li>
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
