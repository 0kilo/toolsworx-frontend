"use client"

import { CalculatorTemplate, CalculatorField, CalculatorResult } from "@/lib/categories/calculators"
import { SidebarAd, FooterAd } from "@/components/ads/ad-unit"
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
  <div className="prose prose-sm max-w-none">
    <h2>About Tip Calculator</h2>
    <p>
      Calculate tips and split bills easily. This calculator helps you determine the appropriate
      tip amount and divides the total among multiple people.
    </p>
    <h3>Standard Tipping Guidelines</h3>
    <ul>
      <li><strong>15%:</strong> Acceptable service</li>
      <li><strong>18%:</strong> Good service</li>
      <li><strong>20%:</strong> Excellent service</li>
      <li><strong>25%+:</strong> Exceptional service</li>
    </ul>
    <h3>When to Tip</h3>
    <ul>
      <li><strong>Restaurants:</strong> 15-20% of bill before tax</li>
      <li><strong>Bars:</strong> $1-2 per drink or 15-20% of tab</li>
      <li><strong>Delivery:</strong> 10-15% or $2-5 minimum</li>
      <li><strong>Taxis/Rideshare:</strong> 15-20% of fare</li>
    </ul>
  </div>
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
          <FooterAd />
        </div>
        <div className="lg:col-span-1">
          <SidebarAd />
        </div>
      </div>
    </div>
  )
}
