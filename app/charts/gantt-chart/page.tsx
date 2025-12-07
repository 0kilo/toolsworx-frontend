import { Metadata } from 'next'
import { generateToolMetadata } from '@/lib/metadata-generator'
import { toolMetadata } from '@/lib/tool-metadata'
import GanttchartClient from './client'

export const metadata: Metadata = generateToolMetadata({
  ...toolMetadata['gantt-chart'],
  category: 'charts/gantt-chart'
})

export default function GanttchartPage() {
  return <GanttchartClient />
}
