import { Metadata } from 'next'
import { generateToolMetadata } from '@/lib/metadata-generator'
import { toolMetadata } from '@/lib/tool-metadata'
import ScientificClient from './client'

export const metadata: Metadata = generateToolMetadata({
  ...toolMetadata['scientific'],
  category: 'calculators/scientific'
})

export default function ScientificPage() {
  return <ScientificClient />
}
