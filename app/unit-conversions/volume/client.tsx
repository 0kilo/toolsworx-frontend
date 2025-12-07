"use client"

import { UnitConverter } from "@/components/shared/unit-converter"
import { AboutDescription } from "@/components/ui/about-description"
import * as Icons from "lucide-react"
import toolContent from "./volume.json"

export default function VolumeConverterClient() {
  const Icon = Icons[toolContent.icon as keyof typeof Icons] as React.ComponentType<{ className?: string }>

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Volume Converter</h1>
            <p className="text-muted-foreground">
              Convert between different volume and liquid measurement units
            </p>
          </div>

          <UnitConverter
            title="Volume & Liquid Conversion"
            description="Convert between milliliters, cups, pints, liters, gallons and more"
            units={toolContent.units}
            baseUnit={toolContent.baseUnit}
            icon={Icon}
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