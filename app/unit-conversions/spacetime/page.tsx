import { Metadata } from 'next'
import { generateSEO } from '@/lib/seo'
import SpaceTimeConverterClient from './client'

export const metadata: Metadata = generateSEO({
  title: 'Space-Time Converter - Light Years, Parsecs, Astronomical Units',
  description: 'Convert between light-years, parsecs, astronomical units, and other cosmic distance measurements. Free online space-time conversion tool.',
  keywords: [
    'space time converter',
    'light year converter',
    'parsec converter',
    'astronomical unit',
    'cosmic distance',
    'space distance calculator',
    'astronomy converter'
  ],
  canonical: 'https://toolsworx.com/unit-conversions/spacetime',
})

export default function SpaceTimeConverterPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Space-Time Converter',
    description: 'Convert between light-years, parsecs, astronomical units, and cosmic distances',
    url: 'https://toolsworx.com/unit-conversions/spacetime',
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
      <SpaceTimeConverterClient />
    </>
  )
}