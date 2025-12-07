import { Metadata } from 'next'
import { generateToolMetadata } from '@/lib/metadata-generator'
import { toolMetadata } from '@/lib/tool-metadata'
import PercentageClient from './client'

export const metadata: Metadata = generateToolMetadata({
  ...toolMetadata['percentage'],
  category: 'calculators/percentage'
})

export default function PercentagePage() {
  return <PercentageClient />
}
