import { Metadata } from 'next'
import { generateToolMetadata } from '@/lib/metadata-generator'
import { toolMetadata } from '@/lib/tool-metadata'
import LengthConverterClient from './client'

export const metadata: Metadata = generateToolMetadata({
  ...toolMetadata.length,
  category: 'unit-conversions/length'
})

export default function LengthConverterPage() {
  return <LengthConverterClient />
}
