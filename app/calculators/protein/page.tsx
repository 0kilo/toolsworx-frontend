"use client"

import { CalculatorTemplate, CalculatorField, CalculatorResult } from "@/lib/categories/calculators"
import { AboutDescription } from "@/components/ui/about-description"
import * as Icons from "lucide-react"
import toolContent from "./protein.json"
import { calculateProtein, ProteinInput } from "@/lib/tools/logic/calculators/calculator-protein"

function handleCalculate(values: Record<string, string>): CalculatorResult[] {
  const input: ProteinInput = {
    weight: parseFloat(values.weight),
    activity: values.activity as ProteinInput["activity"],
    goal: values.goal as ProteinInput["goal"],
  }

  const result = calculateProtein(input)

  return [
    {
      label: "Daily Protein Needs",
      value: `${result.minProtein}-${result.maxProtein} grams/day`,
      format: "text",
      highlight: true,
    },
    {
      label: "Per Meal (3 meals)",
      value: result.perMeal,
      format: "text",
    },
  ]
}

export default function ProteinCalculatorPage() {
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