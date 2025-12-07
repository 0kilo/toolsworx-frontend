import { Metadata } from 'next'
import { generateToolMetadata } from '@/lib/metadata-generator'
import { toolMetadata } from '@/lib/tool-metadata'
import SecretsantaClient from './client'

export const metadata: Metadata = generateToolMetadata({
  ...toolMetadata['secret-santa'],
  category: 'helpful-calculators/secret-santa'
})

export default function SecretsantaPage() {
  return <SecretsantaClient />
}
