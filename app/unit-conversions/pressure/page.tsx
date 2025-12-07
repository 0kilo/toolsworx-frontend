import { Metadata } from 'next'
import { generateToolMetadata } from '@/lib/metadata-generator'
import { toolMetadata } from '@/lib/tool-metadata'
import PressureConverterClient from './client'

export const metadata: Metadata = generateToolMetadata({
  ...toolMetadata.pressure,
  category: 'unit-conversions/pressure'
})

export default function PressureConverterPage() {
  return <PressureConverterClient />
}
