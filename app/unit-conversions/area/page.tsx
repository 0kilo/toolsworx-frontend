import { Metadata } from 'next'
import { generateToolMetadata } from '@/lib/metadata-generator'
import { toolMetadata } from '@/lib/tool-metadata'
import AreaConverterClient from './client'

export const metadata: Metadata = generateToolMetadata({
  ...toolMetadata.area,
  category: 'unit-conversions/area'
})

export default function AreaConverterPage() {
  return <AreaConverterClient />
}
