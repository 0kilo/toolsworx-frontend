"use client"

import { CalculatorTemplate, CalculatorField, CalculatorResult } from "@/lib/categories/calculators"
import { AboutDescription } from "@/components/ui/about-description"
import * as Icons from "lucide-react"
import toolContent from "./bmi.json"
import { calculateBMI, BMIInput } from "@/lib/tools/logic/calculators/calculator-bmi"

function handleCalculate(values: Record<string, string>): CalculatorResult[] {
  const input: BMIInput = {
    weight: parseFloat(values.weight),
    weightUnit: values.weightUnit as "kg" | "lbs",
    height: parseFloat(values.height),
    heightUnit: values.heightUnit as "cm" | "in",
  }

  const result = calculateBMI(input)

  return [
    {
      label: "Your BMI",
      value: result.bmi.toString(),
      format: "number",
      highlight: true,
    },
    {
      label: "Category",
      value: result.category,
      format: "text",
    },
    {
      label: "Advice",
      value: result.advice,
      format: "text",
      helpText: "This is general advice. Consult a healthcare professional for personalized guidance.",
    },
  ]
}

export default function BmiCalculatorClient() {
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
