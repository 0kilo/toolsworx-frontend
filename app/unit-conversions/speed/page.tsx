import { Metadata } from 'next'
import { generateToolMetadata } from '@/lib/metadata-generator'
import { toolMetadata } from '@/lib/tool-metadata'
import SpeedConverterClient from './client'

export const metadata: Metadata = generateToolMetadata({
  ...toolMetadata.speed,
  category: 'unit-conversions/speed'
})

export default function SpeedConverterPage() {
  return <SpeedConverterClient />
}
