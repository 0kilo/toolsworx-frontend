import { Metadata } from 'next'
import { siteConfig } from '@/config/site'
import { ConverterMetadata } from '@/types/converter'

interface SEOProps {
  title: string
  description: string
  keywords?: string[]
  canonical?: string
  noindex?: boolean
}

export function generateSEO({
  title,
  description,
  keywords = [],
  canonical,
  noindex = false,
}: SEOProps): Metadata {
  const fullTitle = `${title} | ${siteConfig.name}`
  const url = canonical || siteConfig.url

  return {
    title: fullTitle,
    description,
    keywords: [...keywords, 'converter', 'free online tools', 'conversion'],
    canonical: url,
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: siteConfig.name,
      type: 'website',
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [siteConfig.ogImage],
    },
    robots: {
      index: !noindex,
      follow: !noindex,
    },
  }
}

export function generateConverterSEO(converter: ConverterMetadata): Metadata {
  return generateSEO({
    title: converter.title,
    description: converter.description,
    keywords: converter.keywords,
    canonical: `${siteConfig.url}${converter.href}`,
  })
}

export function generateStructuredData(converter: ConverterMetadata) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: converter.title,
    description: converter.description,
    url: `${siteConfig.url}${converter.href}`,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    provider: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
    },
  }
}