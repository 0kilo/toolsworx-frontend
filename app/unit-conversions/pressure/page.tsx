"use client"

import { UnitConverter } from "@/components/shared/unit-converter"
import { Gauge } from "lucide-react"

const pressureUnits = [
  { value: "Pa", label: "Pascal", abbreviation: "Pa", factor: 1 },
  { value: "kPa", label: "Kilopascal", abbreviation: "kPa", factor: 1000 },
  { value: "MPa", label: "Megapascal", abbreviation: "MPa", factor: 1000000 },
  { value: "bar", label: "Bar", abbreviation: "bar", factor: 100000 },
  { value: "atm", label: "Atmosphere", abbreviation: "atm", factor: 101325 },
  { value: "psi", label: "Pounds per Square Inch", abbreviation: "psi", factor: 6894.76 },
  { value: "torr", label: "Torr", abbreviation: "torr", factor: 133.322 },
  { value: "mmHg", label: "Millimeters of Mercury", abbreviation: "mmHg", factor: 133.322 },
]

export default function PressureConverterPage() {
  return (
    <UnitConverter
      title="Pressure Converter"
      description="Convert between pascals, bar, PSI, atmospheres, and torr"
      icon={Gauge}
      units={pressureUnits}
      baseUnit="Pa"
      defaultFromUnit="Pa"
      defaultToUnit="psi"
    />
  )
}
