import { Metadata } from 'next'
import { generateToolMetadata } from '@/lib/metadata-generator'
import { toolMetadata } from '@/lib/tool-metadata'
import CheatsheetbuilderClient from './client'

export const metadata: Metadata = generateToolMetadata({
  ...toolMetadata['cheatsheet-builder'],
  category: 'helpful-calculators/cheatsheet-builder'
})

export default function CheatsheetbuilderPage() {
  return <CheatsheetbuilderClient />
}
