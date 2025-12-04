"use client"

import { CalculatorTemplate, CalculatorField, CalculatorResult } from "@/lib/categories/calculators"
import { AboutDescription } from "@/components/ui/about-description"
import * as Icons from "lucide-react"
import toolContent from "./loan.json"
import { calculateLoan, LoanInput } from "@/lib/tools/logic/calculators/calculator-loan"

function handleCalculate(values: Record<string, string>): CalculatorResult[] {
  const input: LoanInput = {
    principal: parseFloat(values.principal),
    downPayment: parseFloat(values.downPayment) || undefined,
    interestRate: parseFloat(values.interestRate),
    loanTerm: parseFloat(values.loanTerm),
  }

  const result = calculateLoan(input)

  const results: CalculatorResult[] = [
    {
      label: "Monthly Payment",
      value: `$${result.monthlyPayment.toFixed(2)}`,
      format: "currency",
      highlight: true,
    },
    {
      label: "Principal Amount",
      value: `$${result.principal.toFixed(2)}`,
      format: "currency",
    },
    {
      label: "Total Interest Paid",
      value: `$${result.totalInterest.toFixed(2)}`,
      format: "currency",
    },
    {
      label: "Total Amount Paid",
      value: `$${result.totalPaid.toFixed(2)}`,
      format: "currency",
    },
    {
      label: "Interest as % of Loan",
      value: `${result.interestPercentage}%`,
      format: "text",
    },
  ]

  if (result.downPayment) {
    results.push({
      label: "Down Payment",
      value: `$${result.downPayment.toFixed(2)}`,
      format: "currency",
    })
  }

  return results
}

export default function LoanCalculatorPage() {
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