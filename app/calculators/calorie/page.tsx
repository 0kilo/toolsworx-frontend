"use client"

import { CalculatorTemplate, CalculatorField, CalculatorResult } from "@/lib/categories/calculators"
import { AboutDescription } from "@/components/ui/about-description"
import * as Icons from "lucide-react"
import toolContent from "./calorie.json"
import { calculateCalories, CalorieInput } from "@/lib/tools/logic/calculators/calculator-calorie"

function handleCalculate(values: Record<string, string>): CalculatorResult[] {
  const input: CalorieInput = {
    age: parseFloat(values.age),
    gender: values.gender as "male" | "female",
    weight: parseFloat(values.weight),
    height: parseFloat(values.height),
    activity: values.activity as CalorieInput["activity"],
  }

  const result = calculateCalories(input)

  return [
    {
      label: "Daily Calorie Needs (calories/day)",
      value: result.dailyCalories,
      format: "number",
      highlight: true,
    },
    {
      label: "For Weight Loss (calories/day)",
      value: result.weightLoss,
      format: "number",
    },
    {
      label: "For Weight Gain (calories/day)",
      value: result.weightGain,
      format: "number",
    },
  ]
}

export default function CalorieCalculatorPage() {
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