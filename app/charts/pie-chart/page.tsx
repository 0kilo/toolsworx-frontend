import { Metadata } from 'next'
import { generateToolMetadata } from '@/lib/metadata-generator'
import { toolMetadata } from '@/lib/tool-metadata'
import PiechartClient from './client'

export const metadata: Metadata = generateToolMetadata({
  ...toolMetadata['pie-chart'],
  category: 'charts/pie-chart'
})

export default function PiechartPage() {
  return <PiechartClient />
}
