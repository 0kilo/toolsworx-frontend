"use client"

import { UnitConverter } from "@/components/shared/unit-converter"
import { AboutDescription } from "@/components/ui/about-description"
import * as Icons from "lucide-react"
import toolContent from "./data.json"

export default function DataConverterPage() {
  const Icon = Icons[toolContent.icon as keyof typeof Icons] as React.ComponentType<{ className?: string }>

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Data Size Converter</h1>
            <p className="text-muted-foreground">
              Convert between different data storage units
            </p>
          </div>

          <UnitConverter
            title="Data Size Conversion"
            description="Convert between bytes, kilobytes, megabytes, gigabytes, and binary units"
            icon={Icon}
            units={toolContent.units}
            baseUnit={toolContent.baseUnit}
            defaultFromUnit={toolContent.defaultFromUnit}
            defaultToUnit={toolContent.defaultToUnit}
          />

          <AboutDescription
            title={`About ${toolContent.title}`}
            description={toolContent.description}
            sections={toolContent.sections}
          />
        </div>

        <div className="lg:col-span-1">
        </div>
      </div>
    </div>
  )
}

