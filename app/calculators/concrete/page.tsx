"use client"

import { CalculatorTemplate, CalculatorField, CalculatorResult } from "@/lib/categories/calculators"
import { AboutDescription } from "@/components/ui/about-description"
import { Truck } from "lucide-react"
import toolContent from "./concrete.json"

const fields: CalculatorField[] = [
  {
    name: "length",
    label: "Length (feet)",
    type: "number",
    placeholder: "Enter length",
    required: true,
  },
  {
    name: "width",
    label: "Width (feet)",
    type: "number",
    placeholder: "Enter width",
    required: true,
  },
  {
    name: "depth",
    label: "Depth (inches)",
    type: "number",
    placeholder: "Enter depth",
    required: true,
  },
]

function calculateConcrete(values: Record<string, string>): CalculatorResult[] {
  const length = parseFloat(values.length)
  const width = parseFloat(values.width)
  const depthInches = parseFloat(values.depth)

  // Convert depth to feet
  const depthFeet = depthInches / 12

  // Calculate cubic feet
  const cubicFeet = length * width * depthFeet

  // Convert to cubic yards (27 cubic feet = 1 cubic yard)
  const cubicYards = cubicFeet / 27

  // Add 10% for waste
  const totalCubicYards = cubicYards * 1.1

  return [
    {
      label: "Concrete Needed (cubic yards)",
      value: totalCubicYards.toFixed(2),
      format: "text",
      highlight: true,
    },
    {
      label: "Volume (cubic feet)",
      value: Math.round(cubicFeet),
      format: "number",
    },
    {
      label: "With 10% Waste (cubic yards)",
      value: Math.ceil(totalCubicYards),
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

export default function ConcreteCalculatorPage() {
  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <CalculatorTemplate
            title="Concrete Calculator"
            description="Calculate cubic yards of concrete needed"
            icon={Truck}
            fields={fields}
            onCalculate={calculateConcrete}
            resultTitle="Concrete Requirements"
            infoContent={infoContent}
          />
        </div>
        <div className="lg:col-span-1">
        </div>
      </div>
    </div>
  )
}