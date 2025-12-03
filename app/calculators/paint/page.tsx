"use client"

import { CalculatorTemplate, CalculatorField, CalculatorResult } from "@/lib/categories/calculators"
import { AboutDescription } from "@/components/ui/about-description"
import { Paintbrush } from "lucide-react"
import toolContent from "./paint.json"

const fields: CalculatorField[] = [
  {
    name: "length",
    label: "Room Length (feet)",
    type: "number",
    placeholder: "Enter length",
    required: true,
  },
  {
    name: "width",
    label: "Room Width (feet)",
    type: "number",
    placeholder: "Enter width",
    required: true,
  },
  {
    name: "height",
    label: "Wall Height (feet)",
    type: "number",
    placeholder: "Enter height",
    required: true,
  },
  {
    name: "coats",
    label: "Number of Coats",
    type: "select",
    options: [
      { value: "1", label: "1 Coat" },
      { value: "2", label: "2 Coats" },
      { value: "3", label: "3 Coats" },
    ],
    required: true,
  },
]

function calculatePaint(values: Record<string, string>): CalculatorResult[] {
  const length = parseFloat(values.length)
  const width = parseFloat(values.width)
  const height = parseFloat(values.height)
  const coats = parseInt(values.coats)

  // Calculate wall area (4 walls)
  const wallArea = 2 * (length * height) + 2 * (width * height)
  
  // Assume 350 sq ft per gallon coverage
  const gallonsPerCoat = wallArea / 350
  const totalGallons = gallonsPerCoat * coats

  return [
    {
      label: "Paint Needed (gallons)",
      value: Math.ceil(totalGallons),
      format: "number",
      highlight: true,
    },
    {
      label: "Wall Area (sq ft)",
      value: Math.round(wallArea),
      format: "number",
    },
    {
      label: "Per Coat (gallons)",
      value: Math.ceil(gallonsPerCoat),
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

export default function PaintCalculatorPage() {
  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <CalculatorTemplate
            title="Paint Calculator"
            description="Calculate gallons of paint needed"
            icon={Paintbrush}
            fields={fields}
            onCalculate={calculatePaint}
            resultTitle="Paint Requirements"
            infoContent={infoContent}
          />
        </div>
        <div className="lg:col-span-1">
        </div>
      </div>
    </div>
  )
}