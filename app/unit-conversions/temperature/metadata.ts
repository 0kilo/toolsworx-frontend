import { Metadata } from 'next'
import { generateSEO, generateStructuredData } from '@/lib/seo'

const converterData = {
  title: 'Temperature Converter',
  description: 'Convert between Celsius, Fahrenheit, Kelvin, and Rankine. Free online temperature conversion tool with instant results.',
  keywords: [
    'temperature converter',
    'celsius to fahrenheit',
    'fahrenheit to celsius', 
    'kelvin converter',
    'temperature conversion',
    'celsius fahrenheit converter',
    'temperature calculator'
  ],
  href: '/unit-conversions/temperature'
}

export const metadata: Metadata = generateSEO({
  title: converterData.title,
  description: converterData.description,
  keywords: converterData.keywords,
  canonical: `https://toolsworx.com${converterData.href}`,
})

export const structuredData = generateStructuredData(converterData as any)