import { Metadata } from 'next'
import { generateSEO } from '@/lib/seo'
import EnergyConverterClient from './client'

export const metadata: Metadata = generateSEO({
  title: 'Energy Converter - Joules, Calories, BTU, kWh',
  description: 'Convert between joules, calories, BTU, kilowatt hours, electron volts and other energy units. Free online energy conversion tool with instant results.',
  keywords: [
    'energy converter',
    'joules to calories',
    'btu converter',
    'kwh converter',
    'energy conversion',
    'electron volt converter',
    'energy calculator'
  ],
  canonical: 'https://toolsworx.com/unit-conversions/energy',
})

export default function EnergyConverterPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Energy Converter',
    description: 'Convert between joules, calories, BTU, kilowatt hours, and electron volts',
    url: 'https://toolsworx.com/unit-conversions/energy',
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <EnergyConverterClient />
    </>
  )
}