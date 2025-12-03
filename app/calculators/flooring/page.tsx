"use client"

import { CalculatorTemplate, CalculatorField, CalculatorResult } from "@/lib/categories/calculators"
import { AboutDescription } from "@/components/ui/about-description"
import { Home } from "lucide-react"
import toolContent from "./flooring.json"

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
    name: "waste",
    label: "Waste Factor",
    type: "select",
    options: [
      { value: "5", label: "5% (Standard)" },
      { value: "10", label: "10% (Diagonal/Pattern)" },
      { value: "15", label: "15% (Complex Layout)" },
    ],
    required: true,
  },
]

function calculateFlooring(values: Record<string, string>): CalculatorResult[] {
  const length = parseFloat(values.length)
  const width = parseFloat(values.width)
  const waste = parseFloat(values.waste)

  const area = length * width
  const wasteAmount = area * (waste / 100)
  const totalArea = area + wasteAmount

  return [
    {
      label: "Total Square Footage Needed (sq ft)",
      value: Math.ceil(totalArea),
      format: "number",
      highlight: true,
    },
    {
      label: "Room Area (sq ft)",
      value: Math.round(area),
      format: "number",
    },
    {
      label: "Waste Allowance (sq ft)",
      value: Math.round(wasteAmount),
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

export default function FlooringCalculatorPage() {
  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <CalculatorTemplate
            title="Flooring Calculator"
            description="Calculate square footage and materials needed"
            icon={Home}
            fields={fields}
            onCalculate={calculateFlooring}
            resultTitle="Flooring Requirements"
            infoContent={infoContent}
          />
        </div>
        <div className="lg:col-span-1">
        </div>
      </div>
    </div>
  )
}