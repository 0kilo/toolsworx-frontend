import { Metadata } from 'next'
import { generateToolMetadata } from '@/lib/metadata-generator'
import { toolMetadata } from '@/lib/tool-metadata'
import MortgageClient from './client'

export const metadata: Metadata = generateToolMetadata({
  ...toolMetadata['mortgage'],
  category: 'calculators/mortgage'
})

export default function MortgagePage() {
  return <MortgageClient />
}
