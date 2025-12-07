import { Metadata } from 'next'
import { generateToolMetadata } from '@/lib/metadata-generator'
import { toolMetadata } from '@/lib/tool-metadata'
import SpeechtotextClient from './client'

export const metadata: Metadata = generateToolMetadata({
  ...toolMetadata['speech-to-text'],
  category: 'media-converters/speech-to-text'
})

export default function SpeechtotextPage() {
  return <SpeechtotextClient />
}
