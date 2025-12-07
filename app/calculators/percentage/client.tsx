"use client"

import { CalculatorTemplate, CalculatorField, CalculatorResult } from "@/lib/categories/calculators"
import { AboutDescription } from "@/components/ui/about-description"
import * as Icons from "lucide-react"
import toolContent from "./percentage.json"
import { calculatePercentage, PercentageInput } from "@/lib/tools/logic/calculators/calculator-percentage"

function handleCalculate(values: Record<string, string>): CalculatorResult[] {
  const input: PercentageInput = {
    value: parseFloat(values.value) || 0,
    percentage: parseFloat(values.percentage) || 0,
    total: parseFloat(values.total) || undefined,
  }

  const result = calculatePercentage(input)
  const results: CalculatorResult[] = []

  if (result.percentageOf !== undefined) {
    results.push({
      label: `${input.percentage}% of ${input.value}`,
      value: result.percentageOf.toFixed(2),
      format: "number",
      highlight: true,
    })
  }

  if (result.valueAsPercentage !== undefined) {
    results.push({
      label: `${input.value} is what % of ${input.total}`,
      value: `${result.valueAsPercentage}%`,
      format: "text",
    })
  }

  if (result.increase !== undefined) {
    results.push({
      label: `${input.value} + ${input.percentage}%`,
      value: result.increase.toFixed(2),
      format: "number",
    })
  }

  if (result.decrease !== undefined) {
    results.push({
      label: `${input.value} - ${input.percentage}%`,
      value: result.decrease.toFixed(2),
      format: "number",
    })
  }

  return results
}

export default function PercentageCalculatorClient() {
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