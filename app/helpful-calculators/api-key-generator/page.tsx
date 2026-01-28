import { Metadata } from 'next'
import { generateToolMetadata } from '@/lib/metadata-generator'
import { toolMetadata } from '@/lib/tool-metadata'
import ApiKeyGeneratorClient from './client'

export const metadata: Metadata = generateToolMetadata({
  ...toolMetadata['api-key-generator'],
  category: 'helpful-calculators/api-key-generator'
})

export default function ApiKeyGeneratorPage() {
  return <ApiKeyGeneratorClient />
}
