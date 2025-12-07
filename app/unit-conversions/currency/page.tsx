import { Metadata } from 'next'
import { generateToolMetadata } from '@/lib/metadata-generator'
import { toolMetadata } from '@/lib/tool-metadata'
import CurrencyConverterClient from './client'

export const metadata: Metadata = generateToolMetadata({
  ...toolMetadata.currency,
  category: 'unit-conversions/currency'
})

export default function CurrencyConverterPage() {
  return <CurrencyConverterClient />
}
