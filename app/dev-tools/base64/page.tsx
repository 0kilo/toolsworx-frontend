import { Metadata } from 'next'
import { generateToolMetadata } from '@/lib/metadata-generator'
import { toolMetadata } from '@/lib/tool-metadata'
import Base64Client from './client'

export const metadata: Metadata = generateToolMetadata({
  ...toolMetadata['base64'],
  category: 'dev-tools/base64'
})

export default function Base64Page() {
  return <Base64Client />
}
