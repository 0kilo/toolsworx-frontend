import { Metadata } from 'next'
import { generateToolMetadata } from '@/lib/metadata-generator'
import { toolMetadata } from '@/lib/tool-metadata'
import PackingListOptimizerClient from './client'

export const metadata: Metadata = generateToolMetadata({
  ...toolMetadata['packing-list-optimizer'],
  category: 'adventure/packing-list-optimizer'
})

export default function PackingListOptimizerPage() {
  return <PackingListOptimizerClient />
}
