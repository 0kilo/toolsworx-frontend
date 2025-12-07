import { Metadata } from 'next'
import { generateToolMetadata } from '@/lib/metadata-generator'
import { toolMetadata } from '@/lib/tool-metadata'
import PasswordgeneratorClient from './client'

export const metadata: Metadata = generateToolMetadata({
  ...toolMetadata['password-generator'],
  category: 'helpful-calculators/password-generator'
})

export default function PasswordgeneratorPage() {
  return <PasswordgeneratorClient />
}
