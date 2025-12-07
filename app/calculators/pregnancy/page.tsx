import { Metadata } from 'next'
import { generateToolMetadata } from '@/lib/metadata-generator'
import { toolMetadata } from '@/lib/tool-metadata'
import PregnancyClient from './client'

export const metadata: Metadata = generateToolMetadata({
  ...toolMetadata['pregnancy'],
  category: 'calculators/pregnancy'
})

export default function PregnancyPage() {
  return <PregnancyClient />
}
