import { Metadata } from 'next'
import { siteConfig } from '@/config/site'

interface ToolMetadata {
  title: string
  description: string
  keywords?: string[]
  category?: string
}

export function generateToolMetadata(tool: ToolMetadata): Metadata {
  const fullTitle = `${tool.title} | ${siteConfig.name}`
  const url = `${siteConfig.url}/${tool.category || 'tools'}`
  
  return {
    title: fullTitle,
    description: tool.description,
    keywords: tool.keywords || [],
    openGraph: {
      title: fullTitle,
      description: tool.description,
      url,
      siteName: siteConfig.name,
      images: [{ url: `${siteConfig.url}/og-image.jpg`, width: 1200, height: 630 }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: tool.description,
      images: [`${siteConfig.url}/og-image.jpg`],
    },
    alternates: {
      canonical: url,
    },
  }
}
