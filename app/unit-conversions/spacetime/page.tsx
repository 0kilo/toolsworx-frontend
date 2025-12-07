import { Metadata } from 'next'
import { generateToolMetadata } from '@/lib/metadata-generator'
import { toolMetadata } from '@/lib/tool-metadata'
import SpaceTimeConverterClient from './client'

export const metadata: Metadata = generateToolMetadata({
  ...toolMetadata.spacetime,
  category: 'unit-conversions/spacetime'
})

export default function SpaceTimeConverterPage() {
  return <SpaceTimeConverterClient />
}
