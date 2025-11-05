"use client"

import { CalculatorTemplate, CalculatorField, CalculatorResult } from "@/lib/categories/calculators"
import { SidebarAd, FooterAd } from "@/components/ads/ad-unit"
import { DollarSign } from "lucide-react"

const fields: CalculatorField[] = [
  {
    name: "loanAmount",
    label: "Loan Amount",
    type: "number",
    placeholder: "Enter loan amount",
    required: true,
    min: 100,
    helpText: "Total amount you want to borrow",
  },
  {
    name: "interestRate",
    label: "Annual Interest Rate (%)",
    type: "number",
    placeholder: "Enter interest rate",
    required: true,
    min: 0,
    max: 50,
    helpText: "Annual interest rate as percentage",
  },
  {
    name: "loanTerm",
    label: "Loan Term",
    type: "number",
    placeholder: "Enter loan term",
    required: true,
    min: 1,
    helpText: "Length of loan",
  },
  {
    name: "termUnit",
    label: "Term Unit",
    type: "select",
    options: [
      { value: "months", label: "Months" },
      { value: "years", label: "Years" },
    ],
    required: true,
  },
]

function calculateLoan(values: Record<string, string>): CalculatorResult[] {
  const principal = parseFloat(values.loanAmount)
  const annualRate = parseFloat(values.interestRate) / 100
  const termValue = parseFloat(values.loanTerm)
  const termUnit = values.termUnit

  // Convert to months
  const months = termUnit === "years" ? termValue * 12 : termValue

  const monthlyRate = annualRate / 12
  const monthlyPayment =
    principal *
    (monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1)

  const totalPayment = monthlyPayment * months
  const totalInterest = totalPayment - principal

  return [
    {
      label: "Monthly Payment",
      value: monthlyPayment,
      format: "currency",
      highlight: true,
    },
    {
      label: "Total Interest",
      value: totalInterest,
      format: "currency",
    },
    {
      label: "Total Payment",
      value: totalPayment,
      format: "currency",
    },
    {
      label: "Loan Amount",
      value: principal,
      format: "currency",
    },
  ]
}

const infoContent = (
  <div className="prose prose-sm max-w-none">
    <h2>About Loan Calculator</h2>
    <p>
      Calculate monthly loan payments for personal loans, auto loans, student loans, or any
      installment loan. The calculator shows your monthly payment, total interest, and total
      amount you'll pay over the life of the loan.
    </p>
    <h3>How to Use</h3>
    <ol>
      <li>Enter the loan amount you need</li>
      <li>Input the annual interest rate</li>
      <li>Choose your loan term (months or years)</li>
      <li>Click calculate to see your monthly payment</li>
    </ol>
    <h3>Tips to Save on Interest</h3>
    <ul>
      <li>Choose the shortest term you can afford</li>
      <li>Make extra payments when possible</li>
      <li>Shop around for the best interest rate</li>
      <li>Consider bi-weekly payments instead of monthly</li>
    </ul>
  </div>
)

export default function LoanCalculatorPage() {
  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <CalculatorTemplate
            title="Loan Calculator"
            description="Calculate loan payments and total interest for any type of loan"
            icon={DollarSign}
            fields={fields}
            onCalculate={calculateLoan}
            resultTitle="Your Loan Breakdown"
            infoContent={infoContent}
          />
          <FooterAd />
        </div>
        <div className="lg:col-span-1">
          <SidebarAd />
        </div>
      </div>
    </div>
  )
}
