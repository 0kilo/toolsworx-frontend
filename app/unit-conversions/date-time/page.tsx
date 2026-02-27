import { Metadata } from 'next'
import { generateToolMetadata } from '@/lib/metadata-generator'
import { toolMetadata } from '@/lib/tool-metadata'
import DateTimeCalculatorClient from './client'

export const metadata: Metadata = generateToolMetadata({
  ...toolMetadata['date-time'],
  category: 'unit-conversions/date-time'
})

export default function DateTimeCalculatorPage() {
  return <DateTimeCalculatorClient />
}
