import { Metadata } from 'next'
import { generateToolMetadata } from '@/lib/metadata-generator'
import { toolMetadata } from '@/lib/tool-metadata'
import ScatterchartClient from './client'

export const metadata: Metadata = generateToolMetadata({
  ...toolMetadata['scatter-chart'],
  category: 'charts/scatter-chart'
})

export default function ScatterchartPage() {
  return <ScatterchartClient />
}
