import { Metadata } from 'next'
import { generateToolMetadata } from '@/lib/metadata-generator'
import { toolMetadata } from '@/lib/tool-metadata'
import EmailextractorClient from './client'

export const metadata: Metadata = generateToolMetadata({
  ...toolMetadata['email-extractor'],
  category: 'dev-tools/email-extractor'
})

export default function EmailextractorPage() {
  return <EmailextractorClient />
}
