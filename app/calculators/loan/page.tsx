import { Metadata } from 'next'
import { generateToolMetadata } from '@/lib/metadata-generator'
import { toolMetadata } from '@/lib/tool-metadata'
import LoanClient from './client'

export const metadata: Metadata = generateToolMetadata({
  ...toolMetadata['loan'],
  category: 'calculators/loan'
})

export default function LoanPage() {
  return <LoanClient />
}
