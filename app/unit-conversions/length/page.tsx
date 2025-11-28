"use client"

import { UnitConverter } from "@/components/shared/unit-converter"
import { AboutDescription } from "@/components/ui/about-description"
import { Ruler } from "lucide-react"

const lengthUnits = [
  { value: "micron", label: "Micron", abbreviation: "μm", factor: 0.000001 },
  { value: "millimeter", label: "Millimeter", abbreviation: "mm", factor: 0.001 },
  { value: "centimeter", label: "Centimeter", abbreviation: "cm", factor: 0.01 },
  { value: "inch", label: "Inch", abbreviation: "in", factor: 0.0254 },
  { value: "foot", label: "Foot", abbreviation: "ft", factor: 0.3048 },
  { value: "yard", label: "Yard", abbreviation: "yd", factor: 0.9144 },
  { value: "meter", label: "Meter", abbreviation: "m", factor: 1 },
  { value: "kilometer", label: "Kilometer", abbreviation: "km", factor: 1000 },
  { value: "mile", label: "Mile", abbreviation: "mi", factor: 1609.344 },
]

export default function LengthConverterPage() {
  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Length Converter</h1>
            <p className="text-muted-foreground">
              Convert between different length and distance units
            </p>
          </div>

          <UnitConverter
            title="Length & Distance Conversion"
            description="Convert between microns, millimeters, inches, feet, meters, kilometers, miles and more"
            units={lengthUnits}
            baseUnit="meter"
            icon={Ruler}
            defaultFromUnit="meter"
            defaultToUnit="foot"
          />


          <AboutDescription
            title="About Length Conversion"
            description="Length conversion is essential for engineering, construction, science, and everyday measurements across different unit systems."
            sections={[
              {
                title: "Common Length Units",
                content: [
                  "Metric: Micron (μm), Millimeter (mm), Centimeter (cm), Meter (m), Kilometer (km)",
                  "Imperial: Inch (in), Foot (ft), Yard (yd), Mile (mi)",
                  "Scientific: Often uses metric system for precision",
                  "Construction: Mix of imperial and metric depending on region"
                ]
              },
              {
                title: "Conversion Examples",
                content: [
                  "1 meter = 3.28084 feet = 39.3701 inches",
                  "1 kilometer = 0.621371 miles = 3280.84 feet",
                  "1 inch = 2.54 centimeters = 25.4 millimeters",
                  "1 mile = 1.60934 kilometers = 5280 feet"
                ]
              },
              {
                title: "Use Cases",
                content: [
                  "Engineering and construction measurements",
                  "International shipping and logistics",
                  "Scientific research and laboratory work",
                  "Travel distance calculations",
                  "Sports and athletics measurements"
                ]
              }
            ]}
          />
        </div>

        <div className="lg:col-span-1">
        </div>
      </div>
    </div>
  )
}