import { Metadata } from 'next'
import { generateToolMetadata } from '@/lib/metadata-generator'
import { toolMetadata } from '@/lib/tool-metadata'
import SunburstchartClient from './client'

export const metadata: Metadata = generateToolMetadata({
  ...toolMetadata['sunburst-chart'],
  category: 'charts/sunburst-chart'
})

export default function SunburstchartPage() {
  return <SunburstchartClient />
}
