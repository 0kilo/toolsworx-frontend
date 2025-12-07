import { Metadata } from 'next'
import { generateToolMetadata } from '@/lib/metadata-generator'
import { toolMetadata } from '@/lib/tool-metadata'
import UrlencoderClient from './client'

export const metadata: Metadata = generateToolMetadata({
  ...toolMetadata['url-encoder'],
  category: 'dev-tools/url-encoder'
})

export default function UrlencoderPage() {
  return <UrlencoderClient />
}
