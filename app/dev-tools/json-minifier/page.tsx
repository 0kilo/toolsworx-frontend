import { Metadata } from 'next'
import { generateToolMetadata } from '@/lib/metadata-generator'
import { toolMetadata } from '@/lib/tool-metadata'
import JsonminifierClient from './client'

export const metadata: Metadata = generateToolMetadata({
  ...toolMetadata['json-minifier'],
  category: 'dev-tools/json-minifier'
})

export default function JsonminifierPage() {
  return <JsonminifierClient />
}
