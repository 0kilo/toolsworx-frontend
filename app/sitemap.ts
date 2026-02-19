import { MetadataRoute } from 'next'
import { allConverters } from '@/lib/registry'
import { categoryGroups } from '@/lib/categories'
import { siteConfig } from '@/config/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
  ]

  // Category pages
  const categoryPathOverrides: Record<string, string> = {
    'developer-tools': '/dev-tools',
  }

  const visibleCategoryGroups = categoryGroups.filter((group) =>
    allConverters.some((converter) => group.categories.includes(converter.category as string))
  )

  const categoryPages = visibleCategoryGroups.map((category) => ({
    url: `${baseUrl}${categoryPathOverrides[category.id] || `/${category.id}`}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Converter pages
  const converterPages = allConverters.map((converter) => ({
    url: `${baseUrl}${converter.href}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: converter.popular ? 0.9 : 0.7,
  }))

  return [...staticPages, ...categoryPages, ...converterPages]
}
