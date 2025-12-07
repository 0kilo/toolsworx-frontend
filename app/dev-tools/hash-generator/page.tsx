import { Metadata } from 'next'
import { generateToolMetadata } from '@/lib/metadata-generator'
import { toolMetadata } from '@/lib/tool-metadata'
import HashgeneratorClient from './client'

export const metadata: Metadata = generateToolMetadata({
  ...toolMetadata['hash-generator'],
  category: 'dev-tools/hash-generator'
})

export default function HashgeneratorPage() {
  return <HashgeneratorClient />
}
