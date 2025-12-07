"use client"

import { CalculatorTemplate, CalculatorField, CalculatorResult } from "@/lib/categories/calculators"
import { AboutDescription } from "@/components/ui/about-description"
import * as Icons from "lucide-react"
import toolContent from "./date-calculator.json"
import { calculateDate, DateInput } from "@/lib/tools/logic/calculators/calculator-date"

function handleCalculate(values: Record<string, string>): CalculatorResult[] {
  const input: DateInput = {
    startDate: values.startDate,
    endDate: values.endDate || undefined,
    addDays: parseInt(values.addDays) || undefined,
    addMonths: parseInt(values.addMonths) || undefined,
    addYears: parseInt(values.addYears) || undefined,
  }

  const result = calculateDate(input)
  const results: CalculatorResult[] = []

  if (result.daysBetween !== undefined) {
    results.push({
      label: "Days Between",
      value: result.daysBetween.toString(),
      format: "number",
      highlight: true,
    })
  }

  if (result.weeksBetween !== undefined) {
    results.push({
      label: "Weeks Between",
      value: result.weeksBetween.toString(),
      format: "number",
    })
  }

  if (result.monthsBetween !== undefined) {
    results.push({
      label: "Months Between",
      value: result.monthsBetween.toString(),
      format: "number",
    })
  }

  if (result.yearsBetween !== undefined) {
    results.push({
      label: "Years Between",
      value: result.yearsBetween.toString(),
      format: "number",
    })
  }

  if (result.newDate) {
    results.push({
      label: "New Date",
      value: result.newDate,
      format: "text",
      highlight: true,
    })
  }

  if (result.dayOfWeek) {
    results.push({
      label: "Day of Week",
      value: result.dayOfWeek,
      format: "text",
    })
  }

  if (result.age) {
    results.push({
      label: "Age (if birth date)",
      value: result.age,
      format: "text",
    })
  }

  return results
}

export default function DateCalculatorClient() {
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