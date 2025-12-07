import { Metadata } from 'next'
import { generateToolMetadata } from '@/lib/metadata-generator'
import { toolMetadata } from '@/lib/tool-metadata'
import TimeConverterClient from './client'

export const metadata: Metadata = generateToolMetadata({
  ...toolMetadata.time,
  category: 'unit-conversions/time'
})

export default function TimeConverterPage() {
  return <TimeConverterClient />
}
