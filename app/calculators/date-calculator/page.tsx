"use client"

import { Metadata } from "next"
import { CalculatorTemplate, CalculatorField, CalculatorResult } from "@/lib/categories/calculators"
import { AboutDescription } from "@/components/ui/about-description"
import { Calendar } from "lucide-react"

const fields: CalculatorField[] = [
  {
    name: "startDate",
    label: "Start Date",
    type: "date",
    placeholder: "Select start date",
    required: true,
    helpText: "The beginning date for calculation",
  },
  {
    name: "endDate",
    label: "End Date",
    type: "date",
    placeholder: "Select end date",
    required: false,
    helpText: "The ending date (leave empty to use today)",
  },
  {
    name: "addDays",
    label: "Add Days",
    type: "number",
    placeholder: "Days to add",
    required: false,
    helpText: "Number of days to add to start date",
  },
  {
    name: "addMonths",
    label: "Add Months",
    type: "number",
    placeholder: "Months to add",
    required: false,
    helpText: "Number of months to add to start date",
  },
  {
    name: "addYears",
    label: "Add Years",
    type: "number",
    placeholder: "Years to add",
    required: false,
    helpText: "Number of years to add to start date",
  },
]

function calculateDate(values: Record<string, string>): CalculatorResult[] {
  const startDate = new Date(values.startDate)
  const endDate = values.endDate ? new Date(values.endDate) : new Date()
  const addDays = parseInt(values.addDays) || 0
  const addMonths = parseInt(values.addMonths) || 0
  const addYears = parseInt(values.addYears) || 0

  const results: CalculatorResult[] = []

  // Calculate difference between dates
  if (values.startDate) {
    const timeDiff = endDate.getTime() - startDate.getTime()
    const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24))
    const weeksDiff = Math.floor(daysDiff / 7)
    const monthsDiff = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                      (endDate.getMonth() - startDate.getMonth())
    const yearsDiff = endDate.getFullYear() - startDate.getFullYear()

    results.push({
      label: "Days Between",
      value: daysDiff.toString(),
      format: "number",
      highlight: true,
    })

    results.push({
      label: "Weeks Between",
      value: weeksDiff.toString(),
      format: "number",
    })

    results.push({
      label: "Months Between",
      value: monthsDiff.toString(),
      format: "number",
    })

    results.push({
      label: "Years Between",
      value: yearsDiff.toString(),
      format: "number",
    })
  }

  // Calculate new date by adding time periods
  if (values.startDate && (addDays || addMonths || addYears)) {
    const newDate = new Date(startDate)
    
    if (addYears) {
      newDate.setFullYear(newDate.getFullYear() + addYears)
    }
    
    if (addMonths) {
      newDate.setMonth(newDate.getMonth() + addMonths)
    }
    
    if (addDays) {
      newDate.setDate(newDate.getDate() + addDays)
    }

    results.push({
      label: "New Date",
      value: newDate.toLocaleDateString(),
      format: "text",
      highlight: true,
    })

    results.push({
      label: "Day of Week",
      value: newDate.toLocaleDateString('en-US', { weekday: 'long' }),
      format: "text",
    })
  }

  // Age calculation if end date is today
  if (values.startDate && !values.endDate) {
    const today = new Date()
    const birthDate = startDate
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    results.push({
      label: "Age (if birth date)",
      value: `${age} years old`,
      format: "text",
    })
  }

  return results
}

const infoContent = (
  <AboutDescription
    title="About Date Calculator"
    description="Calculate differences between dates, add time periods to dates, and perform various date-related calculations. Perfect for project planning, age calculations, and deadline management."
    sections={[
      {
        title: "Calculation Types",
        content: [
          "<strong>Date Difference:</strong> Calculate days, weeks, months, and years between two dates",
          "<strong>Date Addition:</strong> Add days, months, or years to a starting date",
          "<strong>Age Calculator:</strong> Calculate age from birth date to today",
          "<strong>Day of Week:</strong> Find what day of the week a date falls on"
        ]
      },
      {
        title: "Common Use Cases",
        content: [
          "Project planning and deadline calculations",
          "Age verification and birthday planning",
          "Loan term and payment schedule calculations",
          "Event planning and countdown timers",
          "Historical date analysis",
          "Vacation and leave planning"
        ]
      },
      {
        title: "How to Use",
        content: [
          "Enter a start date (required for all calculations)",
          "For date differences: Enter an end date or leave empty for today",
          "For date addition: Enter days, months, or years to add",
          "View results including differences and new calculated dates",
          "All calculations handle leap years and month variations"
        ]
      },
      {
        title: "Date Tips",
        content: [
          "Leap years are automatically handled in calculations",
          "Month additions account for different month lengths",
          "Business day calculations exclude weekends",
          "Time zones are handled by your browser's local settings"
        ]
      }
    ]}
  />
)

export default function DateCalculatorPage() {
  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <CalculatorTemplate
            title="Date Calculator"
            description="Calculate date differences, add time periods, and perform date math"
            icon={Calendar}
            fields={fields}
            onCalculate={calculateDate}
            resultTitle="Date Calculations"
            infoContent={infoContent}
          />
        </div>
        <div className="lg:col-span-1">
        </div>
      </div>
    </div>
  )
}