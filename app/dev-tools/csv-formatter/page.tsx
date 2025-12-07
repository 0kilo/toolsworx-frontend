import { Metadata } from 'next'
import { generateToolMetadata } from '@/lib/metadata-generator'
import { toolMetadata } from '@/lib/tool-metadata'
import CsvformatterClient from './client'

export const metadata: Metadata = generateToolMetadata({
  ...toolMetadata['csv-formatter'],
  category: 'dev-tools/csv-formatter'
})

export default function CsvformatterPage() {
  return <CsvformatterClient />
}
