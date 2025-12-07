import { Metadata } from 'next'
import { generateToolMetadata } from '@/lib/metadata-generator'
import { toolMetadata } from '@/lib/tool-metadata'
import BarchartClient from './client'

export const metadata: Metadata = generateToolMetadata({
  ...toolMetadata['bar-chart'],
  category: 'charts/bar-chart'
})

export default function BarchartPage() {
  return <BarchartClient />
}
