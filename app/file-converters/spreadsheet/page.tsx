import { Metadata } from 'next'
import { generateToolMetadata } from '@/lib/metadata-generator'
import { toolMetadata } from '@/lib/tool-metadata'
import SpreadsheetClient from './client'

export const metadata: Metadata = generateToolMetadata({
  ...toolMetadata['spreadsheet'],
  category: 'file-converters/spreadsheet'
})

export default function SpreadsheetPage() {
  return <SpreadsheetClient />
}
