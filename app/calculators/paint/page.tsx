"use client"

import { CalculatorTemplate, CalculatorField, CalculatorResult } from "@/lib/categories/calculators"
import { AboutDescription } from "@/components/ui/about-description"
import * as Icons from "lucide-react"
import toolContent from "./paint.json"
import { calculatePaint, PaintInput } from "@/lib/tools/logic/calculators/calculator-paint"

function handleCalculate(values: Record<string, string>): CalculatorResult[] {
  const input: PaintInput = {
    length: parseFloat(values.length),
    width: parseFloat(values.width),
    height: parseFloat(values.height),
    coats: parseInt(values.coats),
  }

  const result = calculatePaint(input)

  return [
    {
      label: "Paint Needed (gallons)",
      value: result.totalGallons,
      format: "number",
      highlight: true,
    },
    {
      label: "Wall Area (sq ft)",
      value: result.wallArea,
      format: "number",
    },
    {
      label: "Per Coat (gallons)",
      value: result.gallonsPerCoat,
      format: "number",
    },
  ]
}

export default function PaintCalculatorPage() {
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