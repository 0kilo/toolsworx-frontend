"use client"

import { CalculatorTemplate, CalculatorField, CalculatorResult } from "@/lib/categories/calculators"
import { AboutDescription } from "@/components/ui/about-description"
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
  <AboutDescription
    title="About Loan Calculator"
    description="Calculate monthly loan payments for personal loans, auto loans, student loans, or any installment loan. Get instant results for payment planning."
    sections={[
      {
        title: "How to Use",
        content: [
          "Enter the loan amount you need to borrow",
          "Input the annual interest rate (APR)",
          "Choose your loan term in months or years",
          "Click calculate to see your monthly payment breakdown"
        ]
      },
      {
        title: "Tips to Save on Interest",
        content: [
          "Choose the shortest term you can comfortably afford",
          "Make extra payments toward principal when possible",
          "Shop around with multiple lenders for the best rate",
          "Consider bi-weekly payments instead of monthly",
          "Improve your credit score before applying"
        ]
      },
      {
        title: "Loan Types",
        content: [
          "Personal loans - Unsecured loans for various purposes",
          "Auto loans - Secured by the vehicle being purchased",
          "Student loans - Education financing with special terms",
          "Home equity loans - Secured by your home's equity"
        ]
      }
    ]}
  />
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
        </div>
        <div className="lg:col-span-1">
        </div>
      </div>
    </div>
  )
}
