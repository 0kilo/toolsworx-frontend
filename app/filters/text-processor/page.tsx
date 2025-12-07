import { Metadata } from 'next'
import { generateToolMetadata } from '@/lib/metadata-generator'
import { toolMetadata } from '@/lib/tool-metadata'
import TextprocessorClient from './client'

export const metadata: Metadata = generateToolMetadata({
  ...toolMetadata['text-processor'],
  category: 'filters/text-processor'
})

export default function TextprocessorPage() {
  return <TextprocessorClient />
}
