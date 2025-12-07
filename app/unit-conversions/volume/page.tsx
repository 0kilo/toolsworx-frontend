import { Metadata } from 'next'
import { generateToolMetadata } from '@/lib/metadata-generator'
import { toolMetadata } from '@/lib/tool-metadata'
import VolumeConverterClient from './client'

export const metadata: Metadata = generateToolMetadata({
  ...toolMetadata.volume,
  category: 'unit-conversions/volume'
})

export default function VolumeConverterPage() {
  return <VolumeConverterClient />
}
