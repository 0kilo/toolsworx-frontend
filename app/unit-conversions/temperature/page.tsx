import { Metadata } from 'next'
import { generateToolMetadata } from '@/lib/metadata-generator'
import { toolMetadata } from '@/lib/tool-metadata'
import TemperatureConverterClient from './client'

export const metadata: Metadata = generateToolMetadata({
  ...toolMetadata.temperature,
  category: 'unit-conversions/temperature'
})

export default function TemperatureConverterPage() {
  return <TemperatureConverterClient />
}
