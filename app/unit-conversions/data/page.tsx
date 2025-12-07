import { Metadata } from 'next'
import { generateToolMetadata } from '@/lib/metadata-generator'
import { toolMetadata } from '@/lib/tool-metadata'
import DataConverterClient from './client'

export const metadata: Metadata = generateToolMetadata({
  ...toolMetadata.data,
  category: 'unit-conversions/data'
})

export default function DataConverterPage() {
  return <DataConverterClient />
}
