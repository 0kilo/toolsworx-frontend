import { Metadata } from 'next'
import { generateToolMetadata } from '@/lib/metadata-generator'
import { toolMetadata } from '@/lib/tool-metadata'
import LinechartClient from './client'

export const metadata: Metadata = generateToolMetadata({
  ...toolMetadata['line-chart'],
  category: 'charts/line-chart'
})

export default function LinechartPage() {
  return <LinechartClient />
}
