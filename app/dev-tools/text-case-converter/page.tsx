import { Metadata } from 'next'
import { generateToolMetadata } from '@/lib/metadata-generator'
import { toolMetadata } from '@/lib/tool-metadata'
import TextcaseconverterClient from './client'

export const metadata: Metadata = generateToolMetadata({
  ...toolMetadata['text-case-converter'],
  category: 'dev-tools/text-case-converter'
})

export default function TextcaseconverterPage() {
  return <TextcaseconverterClient />
}
