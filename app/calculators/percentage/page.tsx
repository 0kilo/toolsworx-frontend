"use client"

import { Metadata } from "next"
import { CalculatorTemplate, CalculatorField, CalculatorResult } from "@/lib/categories/calculators"
import { AboutDescription } from "@/components/ui/about-description"
import { Percent } from "lucide-react"

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
    title="About Percentage Calculator"
    description="Calculate percentages, percentage increases/decreases, and determine what percentage one number is of another. Perfect for discounts, tips, taxes, and financial calculations."
    sections={[
      {
        title: "Common Calculations",
        content: [
          "<strong>Percentage of a number:</strong> What is 25% of 200? = 50",
          "<strong>Percentage ratio:</strong> What percentage is 50 of 200? = 25%",
          "<strong>Percentage increase:</strong> 200 + 25% = 250",
          "<strong>Percentage decrease:</strong> 200 - 25% = 150"
        ]
      },
      {
        title: "Real-World Examples",
        content: [
          "Sales tax: Calculate 8.5% tax on $100 purchase",
          "Discounts: Find 20% off original price",
          "Tips: Calculate 15% tip on restaurant bill",
          "Interest: Determine 5% annual interest on savings",
          "Growth rates: Calculate percentage change over time"
        ]
      },
      {
        title: "How to Use",
        content: [
          "Enter the base value you want to calculate from",
          "Enter the percentage (just the number, e.g., 25 for 25%)",
          "Optionally enter a total to find what percentage your value represents",
          "View all calculated results including increases and decreases"
        ]
      }
    ]}
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