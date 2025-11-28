"use client"

import { Metadata } from "next"
import { CalculatorTemplate, CalculatorField, CalculatorResult } from "@/lib/categories/calculators"
import { AboutDescription } from "@/components/ui/about-description"
import { DollarSign } from "lucide-react"

const fields: CalculatorField[] = [
  {
    name: "principal",
    label: "Loan Amount",
    type: "number",
    placeholder: "Enter loan amount",
    required: true,
    min: 1000,
    max: 10000000,
    helpText: "The total amount you want to borrow",
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
    label: "Loan Term",
    type: "number",
    placeholder: "Enter loan term",
    required: true,
    min: 1,
    max: 50,
    helpText: "Length of the loan in years",
  },
]

function calculateLoan(values: Record<string, string>): CalculatorResult[] {
  const principal = parseFloat(values.principal)
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

  return [
    {
      label: "Monthly Payment",
      value: `$${monthlyPayment.toFixed(2)}`,
      format: "currency",
      highlight: true,
    },
    {
      label: "Total Amount Paid",
      value: `$${totalPaid.toFixed(2)}`,
      format: "currency",
    },
    {
      label: "Total Interest Paid",
      value: `$${totalInterest.toFixed(2)}`,
      format: "currency",
    },
    {
      label: "Interest as % of Loan",
      value: `${((totalInterest / principal) * 100).toFixed(1)}%`,
      format: "text",
    },
  ]
}

const infoContent = (
  <AboutDescription
    title="About Loan Calculator"
    description="Calculate monthly payments, total interest, and total cost for any loan. Perfect for mortgages, auto loans, personal loans, and business financing decisions."
    sections={[
      {
        title: "How Loan Payments Work",
        content: [
          "Monthly payments are calculated using the loan amount, interest rate, and term",
          "Early payments go mostly toward interest, later payments toward principal",
          "Longer terms mean lower monthly payments but more total interest",
          "Higher interest rates significantly increase the total cost of borrowing"
        ]
      },
      {
        title: "Loan Types",
        content: [
          "<strong>Mortgage:</strong> 15-30 year terms, typically 3-7% interest",
          "<strong>Auto Loan:</strong> 3-7 year terms, typically 3-10% interest", 
          "<strong>Personal Loan:</strong> 2-7 year terms, typically 6-25% interest",
          "<strong>Business Loan:</strong> Variable terms, typically 5-15% interest"
        ]
      },
      {
        title: "Money-Saving Tips",
        content: [
          "Make extra principal payments to reduce total interest",
          "Choose the shortest term you can afford for lower total cost",
          "Shop around for the best interest rates",
          "Consider bi-weekly payments to pay off loans faster",
          "Improve your credit score before applying for better rates"
        ]
      },
      {
        title: "Important Notes",
        content: [
          "This calculator assumes fixed interest rates",
          "Actual payments may include insurance, taxes, and fees",
          "Results are estimates - consult with lenders for exact terms",
          "Consider your debt-to-income ratio when taking new loans"
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
            description="Calculate monthly payments and total cost for any loan"
            icon={DollarSign}
            fields={fields}
            onCalculate={calculateLoan}
            resultTitle="Your Loan Details"
            infoContent={infoContent}
          />
        </div>
        <div className="lg:col-span-1">
        </div>
      </div>
    </div>
  )
}