import { Metadata } from 'next'
import { generateToolMetadata } from '@/lib/metadata-generator'
import { toolMetadata } from '@/lib/tool-metadata'
import EnergyConverterClient from './client'

export const metadata: Metadata = generateToolMetadata({
  ...toolMetadata.energy,
  category: 'unit-conversions/energy'
})

export default function EnergyConverterPage() {
  return <EnergyConverterClient />
}
