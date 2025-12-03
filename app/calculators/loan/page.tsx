"use client"

import { Metadata } from "next"
import { CalculatorTemplate, CalculatorField, CalculatorResult } from "@/lib/categories/calculators"
import { AboutDescription } from "@/components/ui/about-description"
import { DollarSign } from "lucide-react"
import toolContent from "./loan.json"

const fields: CalculatorField[] = [
  {
    name: "principal",
    label: "Loan Amount / Home Price",
    type: "number",
    placeholder: "Enter loan amount",
    required: true,
    min: 1000,
    max: 10000000,
    helpText: "The total amount you want to borrow (or home price for mortgages)",
  },
  {
    name: "downPayment",
    label: "Down Payment (optional)",
    type: "number",
    placeholder: "Enter down payment",
    required: false,
    min: 0,
    helpText: "Amount you'll pay upfront (for mortgages, leave 0 for regular loans)",
  },
  {
    name: "interestRate",
    label: "Annual Interest Rate (%)",
    type: "number",
    placeholder: "Enter interest rate",
    required: true,
    min: 0.1,
    max: 50,
    step: 0.1,
    helpText: "Annual percentage rate (APR)",
  },
  {
    name: "loanTerm",
    label: "Loan Term (years)",
    type: "number",
    placeholder: "Enter loan term",
    required: true,
    min: 1,
    max: 50,
    helpText: "Length of the loan in years",
  },
]

function calculateLoan(values: Record<string, string>): CalculatorResult[] {
  const loanAmount = parseFloat(values.principal)
  const downPayment = parseFloat(values.downPayment) || 0
  const principal = loanAmount - downPayment
  const annualRate = parseFloat(values.interestRate) / 100
  const years = parseFloat(values.loanTerm)

  // Monthly interest rate
  const monthlyRate = annualRate / 12
  // Total number of payments
  const totalPayments = years * 12

  // Monthly payment calculation using loan formula
  const monthlyPayment = principal * 
    (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / 
    (Math.pow(1 + monthlyRate, totalPayments) - 1)

  // Total amount paid over life of loan
  const totalPaid = monthlyPayment * totalPayments
  
  // Total interest paid
  const totalInterest = totalPaid - principal

  const results: CalculatorResult[] = [
    {
      label: "Monthly Payment",
      value: `$${monthlyPayment.toFixed(2)}`,
      format: "currency",
      highlight: true,
    },
    {
      label: "Principal Amount",
      value: `$${principal.toFixed(2)}`,
      format: "currency",
    },
    {
      label: "Total Interest Paid",
      value: `$${totalInterest.toFixed(2)}`,
      format: "currency",
    },
    {
      label: "Total Amount Paid",
      value: `$${totalPaid.toFixed(2)}`,
      format: "currency",
    },
    {
      label: "Interest as % of Loan",
      value: `${((totalInterest / principal) * 100).toFixed(1)}%`,
      format: "text",
    },
  ]

  if (downPayment > 0) {
    results.push({
      label: "Down Payment",
      value: `$${downPayment.toFixed(2)}`,
      format: "currency",
    })
  }

  return results
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

export default function LoanCalculatorPage() {
  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <CalculatorTemplate
            title="Interest, Loan and Mortgage Calculator"
            description="Calculate monthly payments, interest, and total cost for loans and mortgages"
            icon={DollarSign}
            fields={fields}
            onCalculate={calculateLoan}
            resultTitle="Your Payment Details"
            infoContent={infoContent}
          />
        </div>
        <div className="lg:col-span-1">
        </div>
      </div>
    </div>
  )
}