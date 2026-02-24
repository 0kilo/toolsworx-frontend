import { Metadata } from 'next'
import { generateToolMetadata } from '@/lib/metadata-generator'
import { toolMetadata } from '@/lib/tool-metadata'
import BlogPageGeneratorClient from './client'

export const metadata: Metadata = generateToolMetadata({
  ...toolMetadata['blog-page-generator'],
  category: 'dev-tools/blog-page-generator'
})

export default function BlogPageGeneratorPage() {
  return <BlogPageGeneratorClient />
}
