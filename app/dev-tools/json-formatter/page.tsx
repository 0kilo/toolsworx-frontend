import { Metadata } from 'next'
import { generateToolMetadata } from '@/lib/metadata-generator'
import { toolMetadata } from '@/lib/tool-metadata'
import JsonformatterClient from './client'

export const metadata: Metadata = generateToolMetadata({
  ...toolMetadata['json-formatter'],
  category: 'dev-tools/json-formatter'
})

export default function JsonformatterPage() {
  return <JsonformatterClient />
}
