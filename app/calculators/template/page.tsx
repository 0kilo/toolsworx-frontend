"use client"

import { Metadata } from "next"
import { CalculatorTemplate, CalculatorField, CalculatorResult } from "@/lib/categories/calculators"
import { AboutDescription } from "@/components/ui/about-description"
import { Calculator } from "lucide-react"

const fields: CalculatorField[] = [
  {
    name: "input1",
    label: "Input 1",
    type: "number",
    placeholder: "Enter value",
    required: true,
    helpText: "First input value",
  },
  {
    name: "input2",
    label: "Input 2",
    type: "number",
    placeholder: "Enter value",
    required: true,
    helpText: "Second input value",
  },
]

function calculateTemplate(values: Record<string, string>): CalculatorResult[] {
  const input1 = parseFloat(values.input1)
  const input2 = parseFloat(values.input2)

  // Template calculation logic
  const result = input1 + input2

  return [
    {
      label: "Result",
      value: result.toFixed(2),
      format: "number",
      highlight: true,
    },
  ]
}

const infoContent = (
  <AboutDescription
    title="About Template Calculator"
    description="Template description for calculator functionality."
    sections={[
      {
        title: "How It Works",
        content: [
          "Enter your input values",
          "Click calculate to see results",
          "Review the calculated output"
        ]
      },
      {
        title: "Features",
        content: [
          "Fast and accurate calculations",
          "Easy to use interface",
          "Instant results"
        ]
      }
    ]}
  />
)

export default function TemplateCalculatorPage() {
  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <CalculatorTemplate
            title="Template Calculator"
            description="Template calculator description"
            icon={Calculator}
            fields={fields}
            onCalculate={calculateTemplate}
            resultTitle="Your Results"
            infoContent={infoContent}
          />
        </div>
        <div className="lg:col-span-1">
        </div>
      </div>
    </div>
  )
}