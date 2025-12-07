import { Metadata } from 'next'
import { generateToolMetadata } from '@/lib/metadata-generator'
import { toolMetadata } from '@/lib/tool-metadata'
import UrlextractorClient from './client'

export const metadata: Metadata = generateToolMetadata({
  ...toolMetadata['url-extractor'],
  category: 'dev-tools/url-extractor'
})

export default function UrlextractorPage() {
  return <UrlextractorClient />
}
