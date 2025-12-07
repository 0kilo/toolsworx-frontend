import { Metadata } from 'next'
import { generateToolMetadata } from '@/lib/metadata-generator'
import { toolMetadata } from '@/lib/tool-metadata'
import DatecalculatorClient from './client'

export const metadata: Metadata = generateToolMetadata({
  ...toolMetadata['date-calculator'],
  category: 'calculators/date-calculator'
})

export default function DatecalculatorPage() {
  return <DatecalculatorClient />
}
