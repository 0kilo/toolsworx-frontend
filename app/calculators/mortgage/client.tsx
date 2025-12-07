"use client"

import { CalculatorTemplate, CalculatorField, CalculatorResult } from "@/lib/categories/calculators"
import { AboutDescription } from "@/components/ui/about-description"
import * as Icons from "lucide-react"
import toolContent from "./mortgage.json"
import { calculateMortgage, MortgageInput } from "@/lib/tools/logic/calculators/calculator-mortgage"

function handleCalculate(values: Record<string, string>): CalculatorResult[] {
  const input: MortgageInput = {
    loanAmount: parseFloat(values.loanAmount),
    downPayment: parseFloat(values.downPayment),
    interestRate: parseFloat(values.interestRate),
    loanTerm: parseFloat(values.loanTerm),
  }

  const result = calculateMortgage(input)

  return [
    {
      label: "Monthly Payment",
      value: result.monthlyPayment,
      format: "currency",
      highlight: true,
    },
    {
      label: "Principal Amount",
      value: result.principal,
      format: "currency",
    },
    {
      label: "Total Interest",
      value: result.totalInterest,
      format: "currency",
    },
    {
      label: "Total Payment",
      value: result.totalPayment,
      format: "currency",
    },
    {
      label: "Down Payment",
      value: result.downPayment,
      format: "currency",
    },
  ]
}

export default function MortgageCalculatorClient() {
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
