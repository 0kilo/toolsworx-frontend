"use client"

import { CalculatorTemplate, CalculatorField, CalculatorResult } from "@/lib/categories/calculators"
import { AboutDescription } from "@/components/ui/about-description"
import * as Icons from "lucide-react"
import toolContent from "./tip.json"
import { calculateTip, TipInput } from "@/lib/tools/logic/calculators/calculator-tip"

function handleCalculate(values: Record<string, string>): CalculatorResult[] {
  const input: TipInput = {
    billAmount: parseFloat(values.billAmount),
    tipPercentage: parseFloat(values.tipPercentage),
    numberOfPeople: parseInt(values.numberOfPeople),
  }

  const result = calculateTip(input)

  return [
    {
      label: "Tip Amount",
      value: result.tipAmount,
      format: "currency",
      highlight: true,
    },
    {
      label: "Total with Tip",
      value: result.totalAmount,
      format: "currency",
      highlight: true,
    },
    {
      label: "Per Person (Bill)",
      value: result.perPersonBill,
      format: "currency",
    },
    {
      label: "Per Person (Tip)",
      value: result.perPersonTip,
      format: "currency",
    },
    {
      label: "Per Person (Total)",
      value: result.perPersonTotal,
      format: "currency",
    },
  ]
}

export default function TipCalculatorPage() {
  const Icon = Icons[toolContent.icon as keyof typeof Icons] as React.ComponentType<{ className?: string }>
  
  const infoContent = (
    <AboutDescription
      title={`About ${toolContent.title}`}
      description={toolContent.aboutDescription}
      sections={toolContent.sections.map(section => ({
        title: section.title,
        content: section.content,
        type: section.type as 'list' | 'subsections' | undefined
      }))}
    />
  )

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <CalculatorTemplate
            title={toolContent.title}
            description={toolContent.description}
            icon={Icon}
            fields={toolContent.fields as CalculatorField[]}
            onCalculate={handleCalculate}
            resultTitle={toolContent.resultTitle}
            infoContent={infoContent}
          />
        </div>
        <div className="lg:col-span-1">
        </div>
      </div>
    </div>
  )
}
