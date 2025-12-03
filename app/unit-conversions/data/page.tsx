"use client"

import { UnitConverter } from "@/components/shared/unit-converter"
import { HardDrive } from "lucide-react"

const dataUnits = [
  { value: "bit", label: "Bit", abbreviation: "bit", factor: 1 },
  { value: "byte", label: "Byte", abbreviation: "B", factor: 8 },
  { value: "KB", label: "Kilobyte", abbreviation: "KB", factor: 8000 },
  { value: "MB", label: "Megabyte", abbreviation: "MB", factor: 8000000 },
  { value: "GB", label: "Gigabyte", abbreviation: "GB", factor: 8000000000 },
  { value: "TB", label: "Terabyte", abbreviation: "TB", factor: 8000000000000 },
  { value: "PB", label: "Petabyte", abbreviation: "PB", factor: 8000000000000000 },
  { value: "KiB", label: "Kibibyte", abbreviation: "KiB", factor: 8192 },
  { value: "MiB", label: "Mebibyte", abbreviation: "MiB", factor: 8388608 },
  { value: "GiB", label: "Gibibyte", abbreviation: "GiB", factor: 8589934592 },
  { value: "TiB", label: "Tebibyte", abbreviation: "TiB", factor: 8796093022208 },
]

export default function DataConverterPage() {
  return (
    <UnitConverter
      title="Data Size Converter"
      description="Convert between bytes, kilobytes, megabytes, gigabytes, and binary units"
      icon={HardDrive}
      units={dataUnits}
      baseUnit="bit"
      defaultFromUnit="MB"
      defaultToUnit="GB"
    />
  )
}

/* About section removed - UnitConverter doesn't support aboutTitle/aboutDescription/aboutSections props */

