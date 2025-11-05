"use client"

import { CalculatorTemplate, CalculatorField, CalculatorResult } from "@/lib/categories/calculators"
import { SidebarAd, FooterAd } from "@/components/ads/ad-unit"
import { DollarSign } from "lucide-react"

const fields: CalculatorField[] = [
  {
    name: "loanAmount",
    label: "Home Price / Loan Amount",
    type: "number",
    placeholder: "Enter loan amount",
    required: true,
    min: 1000,
    helpText: "Total amount you want to borrow",
  },
  {
    name: "downPayment",
    label: "Down Payment",
    type: "number",
    placeholder: "Enter down payment",
    required: true,
    min: 0,
    helpText: "Amount you'll pay upfront",
  },
  {
    name: "interestRate",
    label: "Annual Interest Rate (%)",
    type: "number",
    placeholder: "Enter interest rate",
    required: true,
    min: 0,
    max: 30,
    helpText: "Annual interest rate as percentage",
  },
  {
    name: "loanTerm",
    label: "Loan Term (years)",
    type: "number",
    placeholder: "Enter loan term",
    required: true,
    min: 1,
    max: 40,
    helpText: "Number of years to repay",
  },
]

function calculateMortgage(values: Record<string, string>): CalculatorResult[] {
  const homePrice = parseFloat(values.loanAmount)
  const downPayment = parseFloat(values.downPayment)
  const principal = homePrice - downPayment
  const annualRate = parseFloat(values.interestRate) / 100
  const years = parseFloat(values.loanTerm)

  const monthlyRate = annualRate / 12
  const numberOfPayments = years * 12

  const monthlyPayment =
    principal *
    (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1)

  const totalPayment = monthlyPayment * numberOfPayments
  const totalInterest = totalPayment - principal

  return [
    {
      label: "Monthly Payment",
      value: monthlyPayment,
      format: "currency",
      highlight: true,
    },
    {
      label: "Principal Amount",
      value: principal,
      format: "currency",
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
      label: "Down Payment",
      value: downPayment,
      format: "currency",
    },
  ]
}

const infoContent = (
  <div className="prose prose-sm max-w-none">
    <h2>About Mortgage Calculator</h2>
    <p>
      Use this mortgage calculator to estimate your monthly mortgage payment. The calculator
      includes principal and interest, but doesn't include property taxes, homeowners insurance,
      or HOA fees.
    </p>
    <h3>Key Terms</h3>
    <ul>
      <li><strong>Principal:</strong> The amount borrowed</li>
      <li><strong>Interest Rate:</strong> The cost of borrowing money</li>
      <li><strong>Down Payment:</strong> Upfront payment, typically 20% of home price</li>
      <li><strong>Loan Term:</strong> Length of time to repay (15 or 30 years common)</li>
    </ul>
    <h3>Tips for Better Rates</h3>
    <ul>
      <li>Larger down payment = lower monthly payment</li>
      <li>Shorter loan term = less total interest paid</li>
      <li>Good credit score qualifies for better rates</li>
    </ul>
  </div>
)

export default function MortgageCalculatorPage() {
  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <CalculatorTemplate
            title="Mortgage Calculator"
            description="Calculate your monthly mortgage payment and total interest"
            icon={DollarSign}
            fields={fields}
            onCalculate={calculateMortgage}
            resultTitle="Your Monthly Payment"
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
