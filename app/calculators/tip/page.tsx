"use client"

import { CalculatorTemplate, CalculatorField, CalculatorResult } from "@/lib/categories/calculators"
import { AboutDescription } from "@/components/ui/about-description"
import { Percent } from "lucide-react"

const fields: CalculatorField[] = [
  {
    name: "billAmount",
    label: "Bill Amount",
    type: "number",
    placeholder: "Enter bill amount",
    required: true,
    min: 0,
    helpText: "Total bill before tip",
  },
  {
    name: "tipPercentage",
    label: "Tip Percentage (%)",
    type: "number",
    placeholder: "Enter tip percentage",
    required: true,
    min: 0,
    max: 100,
    helpText: "How much to tip (typically 15-20%)",
  },
  {
    name: "numberOfPeople",
    label: "Number of People",
    type: "number",
    placeholder: "Enter number of people",
    required: true,
    min: 1,
    helpText: "Split the bill between how many people?",
  },
]

function calculateTip(values: Record<string, string>): CalculatorResult[] {
  const billAmount = parseFloat(values.billAmount)
  const tipPercentage = parseFloat(values.tipPercentage)
  const numberOfPeople = parseInt(values.numberOfPeople)

  const tipAmount = billAmount * (tipPercentage / 100)
  const totalAmount = billAmount + tipAmount
  const perPersonBill = billAmount / numberOfPeople
  const perPersonTip = tipAmount / numberOfPeople
  const perPersonTotal = totalAmount / numberOfPeople

  return [
    {
      label: "Tip Amount",
      value: tipAmount,
      format: "currency",
      highlight: true,
    },
    {
      label: "Total with Tip",
      value: totalAmount,
      format: "currency",
      highlight: true,
    },
    {
      label: "Per Person (Bill)",
      value: perPersonBill,
      format: "currency",
    },
    {
      label: "Per Person (Tip)",
      value: perPersonTip,
      format: "currency",
    },
    {
      label: "Per Person (Total)",
      value: perPersonTotal,
      format: "currency",
    },
  ]
}

const infoContent = (
  <AboutDescription
    title="About Tip Calculator"
    description="Calculate tips and split bills easily. This calculator helps you determine the appropriate tip amount and divides the total among multiple people."
    sections={[
      {
        title: "Standard Tipping Guidelines",
        content: [
          "<strong>15%:</strong> Acceptable service",
          "<strong>18%:</strong> Good service",
          "<strong>20%:</strong> Excellent service",
          "<strong>25%+:</strong> Exceptional service"
        ]
      },
      {
        title: "When to Tip",
        content: [
          "<strong>Restaurants:</strong> 15-20% of bill before tax",
          "<strong>Bars:</strong> $1-2 per drink or 15-20% of tab",
          "<strong>Delivery:</strong> 10-15% or $2-5 minimum",
          "<strong>Taxis/Rideshare:</strong> 15-20% of fare"
        ]
      }
    ]}
  />
)

export default function TipCalculatorPage() {
  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <CalculatorTemplate
            title="Tip Calculator"
            description="Calculate tips and split bills between multiple people"
            icon={Percent}
            fields={fields}
            onCalculate={calculateTip}
            resultTitle="Tip Breakdown"
            infoContent={infoContent}
          />
        </div>
        <div className="lg:col-span-1">
        </div>
      </div>
    </div>
  )
}
