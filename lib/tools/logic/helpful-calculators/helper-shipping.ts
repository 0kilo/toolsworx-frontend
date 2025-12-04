/**
 * Shipping Cost Calculator Logic
 * Pure functions for calculating shipping rates
 */

export interface ShippingInput {
  weight: number
  length: number
  width: number
  height: number
}

export interface ShippingRate {
  carrier: string
  service: string
  estimatedCost: string
  deliveryTime: string
  features: string[]
  affiliateLink?: string
}

export interface ShippingOutput {
  rates: ShippingRate[]
}

export function calculateDimensionalWeight(length: number, width: number, height: number): number {
  return (length * width * height) / 166
}

export function calculateShippingRates(input: ShippingInput): ShippingOutput {
  const dimWeight = calculateDimensionalWeight(input.length, input.width, input.height)
  const billableWeight = Math.max(input.weight, dimWeight)
  const baseRate = billableWeight * 0.5 + 5

  const rates: ShippingRate[] = [
    {
      carrier: "USPS",
      service: "Priority Mail",
      estimatedCost: `$${(baseRate * 0.85).toFixed(2)}`,
      deliveryTime: "1-3 business days",
      features: ["Free tracking", "Insurance up to $100", "Weekend delivery"],
      affiliateLink: "https://www.usps.com/ship"
    },
    {
      carrier: "USPS",
      service: "Priority Mail Express",
      estimatedCost: `$${(baseRate * 1.5).toFixed(2)}`,
      deliveryTime: "1-2 business days",
      features: ["Overnight to most locations", "Free tracking", "Insurance up to $100"],
      affiliateLink: "https://www.usps.com/ship"
    },
    {
      carrier: "UPS",
      service: "UPS Ground",
      estimatedCost: `$${(baseRate * 0.95).toFixed(2)}`,
      deliveryTime: "1-5 business days",
      features: ["Free tracking", "$100 insurance included", "Signature required"],
      affiliateLink: "https://www.ups.com/ship"
    },
    {
      carrier: "UPS",
      service: "UPS 2nd Day Air",
      estimatedCost: `$${(baseRate * 1.8).toFixed(2)}`,
      deliveryTime: "2 business days",
      features: ["Free tracking", "$100 insurance included", "Saturday delivery available"],
      affiliateLink: "https://www.ups.com/ship"
    },
    {
      carrier: "FedEx",
      service: "FedEx Ground",
      estimatedCost: `$${(baseRate * 0.92).toFixed(2)}`,
      deliveryTime: "1-5 business days",
      features: ["Free tracking", "Money-back guarantee", "$100 insurance"],
      affiliateLink: "https://www.fedex.com/en-us/shipping.html"
    },
    {
      carrier: "FedEx",
      service: "FedEx 2Day",
      estimatedCost: `$${(baseRate * 1.75).toFixed(2)}`,
      deliveryTime: "2 business days",
      features: ["Free tracking", "Money-back guarantee", "Saturday delivery available"],
      affiliateLink: "https://www.fedex.com/en-us/shipping.html"
    },
    {
      carrier: "DHL",
      service: "DHL Ground",
      estimatedCost: `$${(baseRate * 0.88).toFixed(2)}`,
      deliveryTime: "2-5 business days",
      features: ["Free tracking", "Competitive rates", "Business delivery"],
      affiliateLink: "https://www.dhl.com/us-en/home/our-divisions/ecommerce.html"
    },
  ]

  return {
    rates: rates.sort((a, b) =>
      parseFloat(a.estimatedCost.replace('$', '')) - parseFloat(b.estimatedCost.replace('$', ''))
    )
  }
}
