"use client"

import { Metadata } from "next"
import { CalculatorTemplate, CalculatorField, CalculatorResult } from "@/lib/categories/calculators"
import { AboutDescription } from "@/components/ui/about-description"
import { Percent } from "lucide-react"
import toolContent from "./percentage.json"

const fields: CalculatorField[] = [
  {
    name: "value",
    label: "Value",
    type: "number",
    placeholder: "Enter value",
    required: true,
    helpText: "The number to calculate percentage from",
  },
  {
    name: "percentage",
    label: "Percentage",
    type: "number",
    placeholder: "Enter percentage",
    required: true,
    helpText: "The percentage to calculate (e.g., 25 for 25%)",
  },
  {
    name: "total",
    label: "Total (optional)",
    type: "number",
    placeholder: "Enter total",
    required: false,
    helpText: "For calculating what percentage a value is of a total",
  },
]

function calculatePercentage(values: Record<string, string>): CalculatorResult[] {
  const value = parseFloat(values.value) || 0
  const percentage = parseFloat(values.percentage) || 0
  const total = parseFloat(values.total) || 0

  const results: CalculatorResult[] = []

  // Calculate percentage of value
  if (value && percentage) {
    const percentageOfValue = (value * percentage) / 100
    results.push({
      label: `${percentage}% of ${value}`,
      value: percentageOfValue.toFixed(2),
      format: "number",
      highlight: true,
    })
  }

  // Calculate what percentage value is of total
  if (value && total && total !== 0) {
    const valueAsPercentage = (value / total) * 100
    results.push({
      label: `${value} is what % of ${total}`,
      value: `${valueAsPercentage.toFixed(2)}%`,
      format: "text",
    })
  }

  // Calculate percentage increase/decrease
  if (value && percentage) {
    const increase = value + (value * percentage) / 100
    const decrease = value - (value * percentage) / 100
    
    results.push({
      label: `${value} + ${percentage}%`,
      value: increase.toFixed(2),
      format: "number",
    })
    
    results.push({
      label: `${value} - ${percentage}%`,
      value: decrease.toFixed(2),
      format: "number",
    })
  }

  return results
}

const infoContent = (
  <AboutDescription
    title={`About ${toolContent.title}`}
    description={toolContent.description}
    sections={toolContent.sections.map(section => ({
      title: section.title,
      content: section.content,
      type: section.type as 'list' | 'subsections' | undefined
    }))}
  />
)

export default function PercentageCalculatorPage() {
  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <CalculatorTemplate
            title="Percentage Calculator"
            description="Calculate percentages, increases, decreases, and ratios"
            icon={Percent}
            fields={fields}
            onCalculate={calculatePercentage}
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