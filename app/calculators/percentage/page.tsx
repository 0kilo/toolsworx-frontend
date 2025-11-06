"use client"

import { CalculatorTemplate, CalculatorField, CalculatorResult } from "@/lib/categories/calculators"
import { SidebarAd, FooterAd } from "@/components/ads/ad-unit"
import { AboutDescription } from "@/components/ui/about-description"
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
  <AboutDescription
    title="About Percentage Calculator"
    description="Handle three common percentage calculations with instant results. Perfect for discounts, tips, taxes, and growth calculations."
    sections={[
      {
        title: "Calculation Types",
        content: [
          "<strong>What is X% of Y?</strong> - Find a percentage of a number (e.g., 20% of 50 = 10)",
          "<strong>X is what % of Y?</strong> - Find what percentage one number is of another (e.g., 25 is 50% of 50)",
          "<strong>% increase/decrease</strong> - Calculate percentage change between two numbers (e.g., 50 to 75 = 50% increase)"
        ]
      },
      {
        title: "Common Applications",
        content: [
          "<strong>Shopping:</strong> Calculate discounts and sale prices",
          "<strong>Restaurants:</strong> Determine tip amounts (15-20%)",
          "<strong>Taxes:</strong> Add sales tax to purchase prices",
          "<strong>Business:</strong> Calculate growth rates and profit margins",
          "<strong>Education:</strong> Convert test scores to percentages",
          "<strong>Finance:</strong> Calculate interest rates and investment returns"
        ]
      },
      {
        title: "Quick Examples",
        content: [
          "20% discount on $100 item = $80 final price",
          "15% tip on $50 bill = $7.50 tip amount",
          "Sales increased from 100 to 120 = 20% growth",
          "Score 85 out of 100 = 85% grade"
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
