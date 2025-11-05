"use client"

import { CalculatorTemplate, CalculatorField, CalculatorResult } from "@/lib/categories/calculators"
import { SidebarAd, FooterAd } from "@/components/ads/ad-unit"
import { Percent } from "lucide-react"

const fields: CalculatorField[] = [
  {
    name: "calculationType",
    label: "Calculation Type",
    type: "select",
    options: [
      { value: "percentOf", label: "What is X% of Y?" },
      { value: "isWhatPercent", label: "X is what % of Y?" },
      { value: "percentChange", label: "% increase/decrease from X to Y" },
    ],
    required: true,
  },
  {
    name: "value1",
    label: "First Value (X)",
    type: "number",
    placeholder: "Enter first value",
    required: true,
    helpText: "The first number in your calculation",
  },
  {
    name: "value2",
    label: "Second Value (Y)",
    type: "number",
    placeholder: "Enter second value",
    required: true,
    helpText: "The second number in your calculation",
  },
]

function calculatePercentage(values: Record<string, string>): CalculatorResult[] {
  const type = values.calculationType
  const val1 = parseFloat(values.value1)
  const val2 = parseFloat(values.value2)

  if (type === "percentOf") {
    // What is X% of Y?
    const result = (val1 / 100) * val2
    return [
      {
        label: "Result",
        value: result,
        format: "number",
        highlight: true,
        helpText: `${val1}% of ${val2} is ${result.toFixed(2)}`,
      },
    ]
  } else if (type === "isWhatPercent") {
    // X is what % of Y?
    const percentage = (val1 / val2) * 100
    return [
      {
        label: "Result",
        value: `${percentage.toFixed(2)}%`,
        format: "text",
        highlight: true,
        helpText: `${val1} is ${percentage.toFixed(2)}% of ${val2}`,
      },
    ]
  } else {
    // % increase/decrease from X to Y
    const change = val2 - val1
    const percentChange = (change / val1) * 100
    const changeType = percentChange >= 0 ? "Increase" : "Decrease"

    return [
      {
        label: "Percent Change",
        value: `${Math.abs(percentChange).toFixed(2)}%`,
        format: "text",
        highlight: true,
      },
      {
        label: "Change Type",
        value: changeType,
        format: "text",
      },
      {
        label: "Absolute Change",
        value: Math.abs(change).toFixed(2),
        format: "number",
      },
      {
        label: "Original Value",
        value: val1.toFixed(2),
        format: "number",
      },
      {
        label: "New Value",
        value: val2.toFixed(2),
        format: "number",
      },
    ]
  }
}

const infoContent = (
  <div className="prose prose-sm max-w-none">
    <h2>About Percentage Calculator</h2>
    <p>
      This calculator handles three common percentage calculations. Choose the type that matches
      your needs and enter the values.
    </p>

    <h3>Calculation Types</h3>

    <h4>1. What is X% of Y?</h4>
    <p>
      Find a percentage of a number. For example, "What is 15% of 80?"
    </p>
    <p><strong>Example:</strong> 20% of 50 = 10</p>

    <h4>2. X is what % of Y?</h4>
    <p>
      Find what percentage one number is of another. For example, "25 is what % of 100?"
    </p>
    <p><strong>Example:</strong> 25 is 50% of 50</p>

    <h4>3. % increase/decrease from X to Y</h4>
    <p>
      Find the percentage change between two numbers. Useful for calculating price changes,
      growth rates, or discounts.
    </p>
    <p><strong>Example:</strong> From 50 to 75 = 50% increase</p>

    <h3>Common Uses</h3>
    <ul>
      <li><strong>Discounts:</strong> Calculate sale prices</li>
      <li><strong>Tips:</strong> Determine restaurant gratuities</li>
      <li><strong>Taxes:</strong> Add sales tax to prices</li>
      <li><strong>Growth:</strong> Calculate business or investment growth</li>
      <li><strong>Grades:</strong> Convert scores to percentages</li>
    </ul>
  </div>
)

export default function PercentageCalculatorPage() {
  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <CalculatorTemplate
            title="Percentage Calculator"
            description="Calculate percentages, increases, decreases, and more"
            icon={Percent}
            fields={fields}
            onCalculate={calculatePercentage}
            resultTitle="Your Result"
            infoContent={infoContent}
          />
          <FooterAd />
        </div>
        <div className="lg:col-span-1">
          <SidebarAd />
        </div>
      </div>
    </div>
  )
}
