"use client"

import { CalculatorTemplate, CalculatorField, CalculatorResult } from "@/lib/categories/calculators"
import { AboutDescription } from "@/components/ui/about-description"
import * as Icons from "lucide-react"
import toolContent from "./pregnancy.json"
import { calculatePregnancy, PregnancyInput } from "@/lib/tools/logic/calculators/calculator-pregnancy"

function handleCalculate(values: Record<string, string>): CalculatorResult[] {
  const input: PregnancyInput = {
    lastPeriod: values.lastPeriod,
  }

  const result = calculatePregnancy(input)

  return [
    {
      label: "Due Date",
      value: result.dueDate,
      format: "text",
      highlight: true,
    },
    {
      label: "Weeks Pregnant",
      value: result.weeksPregnant,
      format: "text",
    },
    {
      label: "Days Until Due Date",
      value: result.daysUntilDue,
      format: "text",
    },
    {
      label: "Trimester",
      value: result.trimester,
      format: "text",
    },
  ]
}

export default function PregnancyCalculatorClient() {
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