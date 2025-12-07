import { Metadata } from 'next'
import { generateToolMetadata } from '@/lib/metadata-generator'
import { toolMetadata } from '@/lib/tool-metadata'
import ProteinClient from './client'

export const metadata: Metadata = generateToolMetadata({
  ...toolMetadata['protein'],
  category: 'calculators/protein'
})

export default function ProteinPage() {
  return <ProteinClient />
}
