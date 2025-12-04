"use client"

import { CalculatorTemplate, CalculatorField, CalculatorResult } from "@/lib/categories/calculators"
import { AboutDescription } from "@/components/ui/about-description"
import * as Icons from "lucide-react"
import toolContent from "./flooring.json"
import { calculateFlooring, FlooringInput } from "@/lib/tools/logic/calculators/calculator-flooring"

function handleCalculate(values: Record<string, string>): CalculatorResult[] {
  const input: FlooringInput = {
    length: parseFloat(values.length),
    width: parseFloat(values.width),
    waste: parseFloat(values.waste),
  }

  const result = calculateFlooring(input)

  return [
    {
      label: "Total Square Footage Needed (sq ft)",
      value: result.totalArea,
      format: "number",
      highlight: true,
    },
    {
      label: "Room Area (sq ft)",
      value: result.roomArea,
      format: "number",
    },
    {
      label: "Waste Allowance (sq ft)",
      value: result.wasteAmount,
      format: "number",
    },
  ]
}

export default function FlooringCalculatorPage() {
  const Icon = Icons[toolContent.icon as keyof typeof Icons] as React.ComponentType<{ className?: string }>
  
  const infoContent = (
    <AboutDescription
      title={`About ${toolContent.title}`}
      description={toolContent.aboutDescription}
      sections={toolContent.sections.map(section => ({
        title: section.title,
        content: section.content,
        type: section.type as 'list' | 'subsections' | undefined
      }))}
    />
  )

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <CalculatorTemplate
            title={toolContent.title}
            description={toolContent.description}
            icon={Icon}
            fields={toolContent.fields as CalculatorField[]}
            onCalculate={handleCalculate}
            resultTitle={toolContent.resultTitle}
            infoContent={infoContent}
          />
        </div>
        <div className="lg:col-span-1">
        </div>
      </div>
    </div>
  )
}