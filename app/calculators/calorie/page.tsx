"use client"

import { CalculatorTemplate, CalculatorField, CalculatorResult } from "@/lib/categories/calculators"
import { AboutDescription } from "@/components/ui/about-description"
import { Utensils } from "lucide-react"
import toolContent from "./calorie.json"

const fields: CalculatorField[] = [
  {
    name: "age",
    label: "Age",
    type: "number",
    placeholder: "Enter your age",
    required: true,
  },
  {
    name: "gender",
    label: "Gender",
    type: "select",
    options: [
      { value: "male", label: "Male" },
      { value: "female", label: "Female" },
    ],
    required: true,
  },
  {
    name: "weight",
    label: "Weight (kg)",
    type: "number",
    placeholder: "Enter weight in kg",
    required: true,
  },
  {
    name: "height",
    label: "Height (cm)",
    type: "number",
    placeholder: "Enter height in cm",
    required: true,
  },
  {
    name: "activity",
    label: "Activity Level",
    type: "select",
    options: [
      { value: "sedentary", label: "Sedentary (little or no exercise)" },
      { value: "light", label: "Light (exercise 1-3 days/week)" },
      { value: "moderate", label: "Moderate (exercise 3-5 days/week)" },
      { value: "active", label: "Active (exercise 6-7 days/week)" },
      { value: "very_active", label: "Very Active (intense exercise daily)" },
    ],
    required: true,
  },
]

function calculateCalories(values: Record<string, string>): CalculatorResult[] {
  const age = parseFloat(values.age)
  const weight = parseFloat(values.weight)
  const height = parseFloat(values.height)
  const gender = values.gender
  const activity = values.activity

  // Mifflin-St Jeor Equation
  let bmr: number
  if (gender === "male") {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161
  }

  // Activity multipliers
  const activityMultipliers: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  }

  const tdee = bmr * activityMultipliers[activity]

  return [
    {
      label: "Daily Calorie Needs (calories/day)",
      value: Math.round(tdee),
      format: "number",
      highlight: true,
    },
    {
      label: "For Weight Loss (calories/day)",
      value: Math.round(tdee - 500),
      format: "number",
    },
    {
      label: "For Weight Gain (calories/day)",
      value: Math.round(tdee + 500),
      format: "number",
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

export default function CalorieCalculatorPage() {
  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <CalculatorTemplate
            title="Calorie Calculator"
            description="Calculate your daily calorie needs"
            icon={Utensils}
            fields={fields}
            onCalculate={calculateCalories}
            resultTitle="Your Calorie Needs"
            infoContent={infoContent}
          />
        </div>
        <div className="lg:col-span-1">
        </div>
      </div>
    </div>
  )
}