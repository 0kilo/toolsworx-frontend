"use client"

import { CalculatorTemplate, CalculatorField, CalculatorResult } from "@/lib/categories/calculators"
import { AboutDescription } from "@/components/ui/about-description"
import * as Icons from "lucide-react"
import toolContent from "./concrete.json"
import { calculateConcrete, ConcreteInput } from "@/lib/tools/logic/calculators/calculator-concrete"

function handleCalculate(values: Record<string, string>): CalculatorResult[] {
  const input: ConcreteInput = {
    length: parseFloat(values.length),
    width: parseFloat(values.width),
    depth: parseFloat(values.depth),
  }

  const result = calculateConcrete(input)

  return [
    {
      label: "Concrete Needed (cubic yards)",
      value: result.cubicYards.toFixed(2),
      format: "text",
      highlight: true,
    },
    {
      label: "Volume (cubic feet)",
      value: result.cubicFeet,
      format: "number",
    },
    {
      label: "With 10% Waste (cubic yards)",
      value: result.withWaste,
      format: "number",
    },
  ]
}

export default function ConcreteCalculatorClient() {
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