import { Metadata } from 'next'
import { generateToolMetadata } from '@/lib/metadata-generator'
import { toolMetadata } from '@/lib/tool-metadata'
import AreachartClient from './client'

export const metadata: Metadata = generateToolMetadata({
  ...toolMetadata['area-chart'],
  category: 'charts/area-chart'
})

export default function AreachartPage() {
  return <AreachartClient />
}
