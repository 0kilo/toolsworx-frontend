import { Metadata } from "next"
import { FormulaConverter } from "@/components/converters/formula-converter"
import { convertTemperature } from "@/lib/converters/formula-converters"
import { SidebarAd, FooterAd } from "@/components/ads/ad-unit"

export const metadata: Metadata = {
  title: "Fahrenheit to Celsius Converter",
  description: "Convert temperature from Fahrenheit to Celsius instantly. Free and accurate.",
  keywords: ["fahrenheit", "celsius", "temperature", "converter", "f to c"],
}

const temperatureUnits = [
  { value: "fahrenheit", label: "Fahrenheit", abbreviation: "°F" },
  { value: "celsius", label: "Celsius", abbreviation: "°C" },
  { value: "kelvin", label: "Kelvin", abbreviation: "K" },
]

export default function FahrenheitCelsiusPage() {
  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <FormulaConverter
            title="Fahrenheit to Celsius Converter"
            description="Convert temperature between Fahrenheit, Celsius, and Kelvin"
            units={temperatureUnits}
            defaultFromUnit="fahrenheit"
            defaultToUnit="celsius"
            onConvert={convertTemperature}
            placeholder="Enter temperature"
            resultLabel="Converted Temperature"
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
