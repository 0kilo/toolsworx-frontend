import { Metadata } from 'next'
import { generateToolMetadata } from '@/lib/metadata-generator'
import { toolMetadata } from '@/lib/tool-metadata'
import JsonvalidatorClient from './client'

export const metadata: Metadata = generateToolMetadata({
  ...toolMetadata['json-validator'],
  category: 'dev-tools/json-validator'
})

export default function JsonvalidatorPage() {
  return <JsonvalidatorClient />
}
