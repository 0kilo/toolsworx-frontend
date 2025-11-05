"use client"

import { Metadata } from "next"
import { CalculatorTemplate, CalculatorField, CalculatorResult } from "@/lib/categories/calculators"
import { SidebarAd, FooterAd } from "@/components/ads/ad-unit"
import { Heart } from "lucide-react"

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
  <div className="prose prose-sm max-w-none">
    <h2>About BMI Calculator</h2>
    <p>
      Body Mass Index (BMI) is a measure of body fat based on height and weight. It's widely
      used as a screening tool to identify potential weight problems.
    </p>
    <h3>BMI Categories</h3>
    <ul>
      <li><strong>Underweight:</strong> BMI less than 18.5</li>
      <li><strong>Normal weight:</strong> BMI 18.5-24.9</li>
      <li><strong>Overweight:</strong> BMI 25-29.9</li>
      <li><strong>Obese:</strong> BMI 30 or greater</li>
    </ul>
    <h3>Important Notes</h3>
    <p>
      BMI is a screening tool, not a diagnostic tool. It doesn't account for muscle mass,
      bone density, or body composition. Athletes and bodybuilders may have high BMI due to
      muscle mass, not excess fat.
    </p>
  </div>
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
          <FooterAd />
        </div>
        <div className="lg:col-span-1">
          <SidebarAd />
        </div>
      </div>
    </div>
  )
}
