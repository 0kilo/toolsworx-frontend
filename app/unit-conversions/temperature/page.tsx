import { Metadata } from 'next'
import { generateSEO } from '@/lib/seo'
import TemperatureConverterClient from './client'

export const metadata: Metadata = generateSEO({
  title: 'Temperature Converter - Celsius, Fahrenheit, Kelvin',
  description: 'Convert between Celsius, Fahrenheit, Kelvin, and Rankine. Free online temperature conversion tool with instant results and conversion formulas.',
  keywords: [
    'temperature converter',
    'celsius to fahrenheit',
    'fahrenheit to celsius', 
    'kelvin converter',
    'temperature conversion',
    'celsius fahrenheit converter',
    'temperature calculator'
  ],
  canonical: 'https://toolsworx.com/unit-conversions/temperature',
})

export default function TemperatureConverterPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Temperature Converter',
    description: 'Convert between Celsius, Fahrenheit, Kelvin, and Rankine temperature scales',
    url: 'https://toolsworx.com/unit-conversions/temperature',
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
      <TemperatureConverterClient />
    </>
  )
}