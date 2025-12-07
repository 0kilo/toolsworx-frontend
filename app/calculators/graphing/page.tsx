import { Metadata } from 'next'
import { generateToolMetadata } from '@/lib/metadata-generator'
import { toolMetadata } from '@/lib/tool-metadata'
import GraphingClient from './client'

export const metadata: Metadata = generateToolMetadata({
  ...toolMetadata['graphing'],
  category: 'calculators/graphing'
})

export default function GraphingPage() {
  return <GraphingClient />
}
