"use client"

import { CalculatorTemplate, CalculatorField, CalculatorResult } from "@/lib/categories/calculators"
import { SidebarAd, FooterAd } from "@/components/ads/ad-unit"
import { AboutDescription } from "@/components/ui/about-description"
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
  <AboutDescription
    title="About Mortgage Calculator"
    description="Calculate your monthly mortgage payment including principal and interest. This calculator helps you estimate home affordability and compare loan options."
    sections={[
      {
        title: "Key Mortgage Terms",
        content: [
          "<strong>Principal:</strong> The loan amount borrowed to purchase the home",
          "<strong>Interest Rate:</strong> Annual percentage rate (APR) charged by the lender",
          "<strong>Down Payment:</strong> Upfront payment, typically 10-20% of home price",
          "<strong>Loan Term:</strong> Repayment period, commonly 15 or 30 years",
          "<strong>PMI:</strong> Private mortgage insurance required if down payment < 20%"
        ]
      },
      {
        title: "Tips for Better Mortgage Rates",
        content: [
          "Make a larger down payment to reduce loan amount and avoid PMI",
          "Choose shorter loan terms (15 years) for lower total interest",
          "Improve credit score before applying for better rates",
          "Shop around with multiple lenders for competitive rates",
          "Consider paying points to reduce interest rate"
        ]
      },
      {
        title: "Additional Costs to Consider",
        content: [
          "Property taxes - varies by location and home value",
          "Homeowners insurance - protects against damage and liability",
          "HOA fees - monthly/annual homeowners association dues",
          "Closing costs - typically 2-5% of home purchase price",
          "Maintenance and repairs - budget 1-3% of home value annually"
        ]
      }
    ]}
  />
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
