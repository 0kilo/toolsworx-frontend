import { Metadata } from 'next'
import { generateSEO } from '@/lib/seo'
import ImageConverterClient from './client'

export const metadata: Metadata = generateSEO({
  title: 'Image Converter - JPG, PNG, WebP, GIF Format Converter',
  description: 'Convert images between JPG, PNG, WebP, GIF, BMP, and TIFF formats. Free online image converter with quality preservation and instant results.',
  keywords: [
    'image converter',
    'jpg to png',
    'png to jpg',
    'webp converter',
    'gif converter',
    'image format converter',
    'photo converter',
    'picture converter'
  ],
  canonical: 'https://toolsworx.com/media-converters/image',
})

export default function ImageConverterPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Image Converter',
    description: 'Convert images between JPG, PNG, WebP, GIF, BMP, and TIFF formats',
    url: 'https://toolsworx.com/media-converters/image',
    applicationCategory: 'MultimediaApplication',
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
      <ImageConverterClient />
    </>
  )
}