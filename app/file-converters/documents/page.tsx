import { Metadata } from 'next'
import { generateToolMetadata } from '@/lib/metadata-generator'
import { toolMetadata } from '@/lib/tool-metadata'
import DocumentsClient from './client'

export const metadata: Metadata = generateToolMetadata({
  ...toolMetadata['documents'],
  category: 'file-converters/documents'
})

export default function DocumentsPage() {
  return <DocumentsClient />
}
