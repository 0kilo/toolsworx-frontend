"use client"

import { CalculatorTemplate, CalculatorField, CalculatorResult } from "@/lib/categories/calculators"
import { AboutDescription } from "@/components/ui/about-description"
import { Dumbbell } from "lucide-react"
import toolContent from "./protein.json"

const fields: CalculatorField[] = [
  {
    name: "weight",
    label: "Weight (kg)",
    type: "number",
    placeholder: "Enter weight in kg",
    required: true,
  },
  {
    name: "activity",
    label: "Activity Level",
    type: "select",
    options: [
      { value: "sedentary", label: "Sedentary" },
      { value: "light", label: "Light Activity" },
      { value: "moderate", label: "Moderate Activity" },
      { value: "active", label: "Very Active" },
      { value: "athlete", label: "Athlete" },
    ],
    required: true,
  },
  {
    name: "goal",
    label: "Goal",
    type: "select",
    options: [
      { value: "maintain", label: "Maintain Weight" },
      { value: "lose", label: "Lose Weight" },
      { value: "gain", label: "Build Muscle" },
    ],
    required: true,
  },
]

function calculateProtein(values: Record<string, string>): CalculatorResult[] {
  const weight = parseFloat(values.weight)
  const activity = values.activity
  const goal = values.goal

  const proteinRanges: Record<string, Record<string, [number, number]>> = {
    sedentary: { maintain: [0.8, 1.0], lose: [1.0, 1.2], gain: [1.2, 1.4] },
    light: { maintain: [1.0, 1.2], lose: [1.2, 1.4], gain: [1.4, 1.6] },
    moderate: { maintain: [1.2, 1.4], lose: [1.4, 1.6], gain: [1.6, 1.8] },
    active: { maintain: [1.4, 1.6], lose: [1.6, 1.8], gain: [1.8, 2.0] },
    athlete: { maintain: [1.6, 1.8], lose: [1.8, 2.0], gain: [2.0, 2.2] },
  }

  const [minMultiplier, maxMultiplier] = proteinRanges[activity][goal]
  const minProtein = weight * minMultiplier
  const maxProtein = weight * maxMultiplier

  return [
    {
      label: "Daily Protein Needs",
      value: `${Math.round(minProtein)}-${Math.round(maxProtein)} grams/day`,
      format: "text",
      highlight: true,
    },
    {
      label: "Per Meal (3 meals)",
      value: `${Math.round(minProtein / 3)}-${Math.round(maxProtein / 3)} grams`,
      format: "text",
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

export default function ProteinCalculatorPage() {
  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <CalculatorTemplate
            title="Protein Calculator"
            description="Calculate your daily protein needs"
            icon={Dumbbell}
            fields={fields}
            onCalculate={calculateProtein}
            resultTitle="Your Protein Needs"
            infoContent={infoContent}
          />
        </div>
        <div className="lg:col-span-1">
        </div>
      </div>
    </div>
  )
}