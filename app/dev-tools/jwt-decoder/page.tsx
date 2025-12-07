import { Metadata } from 'next'
import { generateToolMetadata } from '@/lib/metadata-generator'
import { toolMetadata } from '@/lib/tool-metadata'
import JwtdecoderClient from './client'

export const metadata: Metadata = generateToolMetadata({
  ...toolMetadata['jwt-decoder'],
  category: 'dev-tools/jwt-decoder'
})

export default function JwtdecoderPage() {
  return <JwtdecoderClient />
}
