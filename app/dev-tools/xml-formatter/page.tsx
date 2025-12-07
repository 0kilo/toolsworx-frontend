import { Metadata } from 'next'
import { generateToolMetadata } from '@/lib/metadata-generator'
import { toolMetadata } from '@/lib/tool-metadata'
import XmlformatterClient from './client'

export const metadata: Metadata = generateToolMetadata({
  ...toolMetadata['xml-formatter'],
  category: 'dev-tools/xml-formatter'
})

export default function XmlformatterPage() {
  return <XmlformatterClient />
}
