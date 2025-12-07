import { Metadata } from 'next'
import { generateToolMetadata } from '@/lib/metadata-generator'
import { toolMetadata } from '@/lib/tool-metadata'
import ConcreteClient from './client'

export const metadata: Metadata = generateToolMetadata({
  ...toolMetadata['concrete'],
  category: 'calculators/concrete'
})

export default function ConcretePage() {
  return <ConcreteClient />
}
