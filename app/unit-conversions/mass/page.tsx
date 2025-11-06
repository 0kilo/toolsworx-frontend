"use client"

import { UnitConverter } from "@/components/shared/unit-converter"
import { SidebarAd, FooterAd } from "@/components/ads/ad-unit"
import { AboutDescription } from "@/components/ui/about-description"
import { Weight } from "lucide-react"

const massUnits = [
  { value: "microgram", label: "Microgram", abbreviation: "μg", factor: 0.000000001 },
  { value: "milligram", label: "Milligram", abbreviation: "mg", factor: 0.000001 },
  { value: "gram", label: "Gram", abbreviation: "g", factor: 0.001 },
  { value: "ounce", label: "Ounce", abbreviation: "oz", factor: 0.0283495 },
  { value: "pound", label: "Pound", abbreviation: "lb", factor: 0.453592 },
  { value: "kilogram", label: "Kilogram", abbreviation: "kg", factor: 1 },
  { value: "stone", label: "Stone", abbreviation: "st", factor: 6.35029 },
  { value: "ton", label: "Metric Ton", abbreviation: "t", factor: 1000 },
  { value: "short-ton", label: "Short Ton (US)", abbreviation: "ton", factor: 907.185 },
  { value: "long-ton", label: "Long Ton (UK)", abbreviation: "LT", factor: 1016.05 },
]

export default function MassConverterPage() {
  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Mass & Weight Converter</h1>
            <p className="text-muted-foreground">
              Convert between different mass and weight units
            </p>
          </div>

          <UnitConverter
            title="Mass & Weight Conversion"
            description="Convert between micrograms, grams, ounces, pounds, kilograms, tons and more"
            units={massUnits}
            baseUnit="kilogram"
            icon={Weight}
            defaultFromUnit="kilogram"
            defaultToUnit="pound"
          />

          <FooterAd />

          <AboutDescription
            title="About Mass & Weight Conversion"
            description="Mass and weight conversions are crucial for cooking, shipping, science, and international commerce across different measurement systems."
            sections={[
              {
                title: "Common Mass Units",
                content: [
                  "Metric: Microgram (μg), Milligram (mg), Gram (g), Kilogram (kg), Metric Ton (t)",
                  "Imperial: Ounce (oz), Pound (lb), Stone (st), Short Ton, Long Ton",
                  "Scientific: Typically uses metric system for precision",
                  "Cooking: Mix of grams, ounces, and pounds depending on region"
                ]
              },
              {
                title: "Conversion Examples",
                content: [
                  "1 kilogram = 2.20462 pounds = 35.274 ounces",
                  "1 pound = 0.453592 kilograms = 16 ounces",
                  "1 ounce = 28.3495 grams = 28,349.5 milligrams",
                  "1 metric ton = 1000 kilograms = 2204.62 pounds"
                ]
              },
              {
                title: "Use Cases",
                content: [
                  "Cooking and recipe measurements",
                  "Shipping and logistics calculations",
                  "Scientific research and laboratory work",
                  "Medical dosage calculations",
                  "Industrial and manufacturing processes"
                ]
              }
            ]}
          />
        </div>

        <div className="lg:col-span-1">
          <SidebarAd />
        </div>
      </div>
    </div>
  )
}