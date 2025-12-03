"use client"

import { CalculatorTemplate, CalculatorField, CalculatorResult } from "@/lib/categories/calculators"
import { AboutDescription } from "@/components/ui/about-description"
import { Baby } from "lucide-react"
import toolContent from "./pregnancy.json"

const fields: CalculatorField[] = [
  {
    name: "lastPeriod",
    label: "First Day of Last Period",
    type: "date",
    required: true,
    helpText: "Enter the first day of your last menstrual period",
  },
]

function calculatePregnancy(values: Record<string, string>): CalculatorResult[] {
  const lastPeriod = new Date(values.lastPeriod)
  const today = new Date()
  
  // Due date is 280 days (40 weeks) from last period
  const dueDate = new Date(lastPeriod)
  dueDate.setDate(dueDate.getDate() + 280)
  
  // Calculate weeks pregnant
  const daysDiff = Math.floor((today.getTime() - lastPeriod.getTime()) / (1000 * 60 * 60 * 24))
  const weeks = Math.floor(daysDiff / 7)
  const days = daysDiff % 7
  
  // Calculate days until due date
  const daysUntilDue = Math.floor((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  return [
    {
      label: "Due Date",
      value: dueDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      format: "text",
      highlight: true,
    },
    {
      label: "Weeks Pregnant",
      value: `${weeks} weeks, ${days} days`,
      format: "text",
    },
    {
      label: "Days Until Due Date",
      value: daysUntilDue > 0 ? daysUntilDue.toString() : "Baby is due!",
      format: "text",
    },
    {
      label: "Trimester",
      value: weeks < 13 ? "First" : weeks < 27 ? "Second" : "Third",
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

export default function PregnancyCalculatorPage() {
  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <CalculatorTemplate
            title="Pregnancy Due Date Calculator"
            description="Calculate your due date and weeks pregnant"
            icon={Baby}
            fields={fields}
            onCalculate={calculatePregnancy}
            resultTitle="Your Pregnancy Timeline"
            infoContent={infoContent}
          />
        </div>
        <div className="lg:col-span-1">
        </div>
      </div>
    </div>
  )
}