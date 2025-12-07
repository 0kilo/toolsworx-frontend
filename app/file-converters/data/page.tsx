import { Metadata } from 'next'
import { generateToolMetadata } from '@/lib/metadata-generator'
import { toolMetadata } from '@/lib/tool-metadata'
import DataClient from './client'

export const metadata: Metadata = generateToolMetadata({
  ...toolMetadata['data'],
  category: 'file-converters/data'
})

export default function DataPage() {
  return <DataClient />
}
