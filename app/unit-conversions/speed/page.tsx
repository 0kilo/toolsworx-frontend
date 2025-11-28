"use client"

import { UnitConverter } from "@/components/shared/unit-converter"
import { AboutDescription } from "@/components/ui/about-description"
import { Gauge } from "lucide-react"

const speedUnits = [
  { value: "mps", label: "Meters per Second", abbreviation: "m/s", factor: 1 },
  { value: "kph", label: "Kilometers per Hour", abbreviation: "km/h", factor: 0.277778 },
  { value: "mph", label: "Miles per Hour", abbreviation: "mph", factor: 0.44704 },
  { value: "fps", label: "Feet per Second", abbreviation: "ft/s", factor: 0.3048 },
  { value: "knots", label: "Knots", abbreviation: "kn", factor: 0.514444 },
  { value: "mach", label: "Mach (at sea level)", abbreviation: "Ma", factor: 343 },
  { value: "c", label: "Speed of Light", abbreviation: "c", factor: 299792458 },
]

export default function SpeedConverterPage() {
  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Speed Converter</h1>
            <p className="text-muted-foreground">
              Convert between different speed and velocity units
            </p>
          </div>

          <UnitConverter
            title="Speed & Velocity Conversion"
            description="Convert between m/s, km/h, mph, knots, Mach, and more"
            units={speedUnits}
            baseUnit="mps"
            icon={Gauge}
            defaultFromUnit="mph"
            defaultToUnit="kph"
          />


          <AboutDescription
            title="About Speed Conversion"
            description="Speed conversion is essential for transportation, physics, engineering, and navigation across different measurement systems."
            sections={[
              {
                title: "Speed Units",
                content: [
                  "Metric: Meters per second (m/s), Kilometers per hour (km/h)",
                  "Imperial: Miles per hour (mph), Feet per second (ft/s)",
                  "Nautical: Knots (kn) - used in aviation and marine navigation",
                  "Scientific: Mach (speed of sound), Speed of light (c)"
                ]
              },
              {
                title: "Conversion Examples",
                content: [
                  "60 mph = 96.56 km/h = 26.82 m/s",
                  "100 km/h = 62.14 mph = 27.78 m/s",
                  "1 knot = 1.852 km/h = 1.151 mph",
                  "Mach 1 = 343 m/s = 1,235 km/h = 767 mph"
                ]
              },
              {
                title: "Use Cases",
                content: [
                  "Vehicle speed limit conversions",
                  "Aviation and marine navigation",
                  "Physics and engineering calculations",
                  "Sports performance measurements",
                  "Weather and wind speed reporting"
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