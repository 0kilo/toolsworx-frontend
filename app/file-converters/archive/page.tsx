import { Metadata } from 'next'
import { generateToolMetadata } from '@/lib/metadata-generator'
import { toolMetadata } from '@/lib/tool-metadata'
import ArchiveClient from './client'

export const metadata: Metadata = generateToolMetadata({
  ...toolMetadata['archive'],
  category: 'file-converters/archive'
})

export default function ArchivePage() {
  return <ArchiveClient />
}
