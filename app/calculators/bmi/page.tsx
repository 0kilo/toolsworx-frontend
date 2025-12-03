"use client"

import { Metadata } from "next"
import { CalculatorTemplate, CalculatorField, CalculatorResult } from "@/lib/categories/calculators"
import { AboutDescription } from "@/components/ui/about-description"
import { Heart } from "lucide-react"
import toolContent from "./bmi.json"

const fields: CalculatorField[] = [
  {
    name: "weight",
    label: "Weight",
    type: "number",
    placeholder: "Enter weight",
    required: true,
    min: 20,
    max: 500,
    helpText: "Your weight",
  },
  {
    name: "weightUnit",
    label: "Weight Unit",
    type: "select",
    options: [
      { value: "kg", label: "Kilograms (kg)" },
      { value: "lbs", label: "Pounds (lbs)" },
    ],
    required: true,
  },
  {
    name: "height",
    label: "Height",
    type: "number",
    placeholder: "Enter height",
    required: true,
    min: 50,
    max: 300,
    helpText: "Your height",
  },
  {
    name: "heightUnit",
    label: "Height Unit",
    type: "select",
    options: [
      { value: "cm", label: "Centimeters (cm)" },
      { value: "in", label: "Inches (in)" },
    ],
    required: true,
  },
]

function calculateBMI(values: Record<string, string>): CalculatorResult[] {
  let weight = parseFloat(values.weight)
  let height = parseFloat(values.height)

  // Convert to metric
  if (values.weightUnit === "lbs") {
    weight = weight * 0.453592
  }
  if (values.heightUnit === "in") {
    height = height * 2.54
  }

  // Calculate BMI
  const heightInMeters = height / 100
  const bmi = weight / (heightInMeters * heightInMeters)

  // Determine category
  let category = ""
  let advice = ""
  if (bmi < 18.5) {
    category = "Underweight"
    advice = "Consider consulting a healthcare provider for guidance"
  } else if (bmi < 25) {
    category = "Normal weight"
    advice = "Maintain your healthy lifestyle"
  } else if (bmi < 30) {
    category = "Overweight"
    advice = "Consider a balanced diet and regular exercise"
  } else {
    category = "Obese"
    advice = "Consult a healthcare provider for personalized advice"
  }

  return [
    {
      label: "Your BMI",
      value: bmi.toFixed(1),
      format: "number",
      highlight: true,
    },
    {
      label: "Category",
      value: category,
      format: "text",
    },
    {
      label: "Advice",
      value: advice,
      format: "text",
      helpText: "This is general advice. Consult a healthcare professional for personalized guidance.",
    },
  ]
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

export default function BMICalculatorPage() {
  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <CalculatorTemplate
            title="BMI Calculator"
            description="Calculate your Body Mass Index and understand your weight category"
            icon={Heart}
            fields={fields}
            onCalculate={calculateBMI}
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
