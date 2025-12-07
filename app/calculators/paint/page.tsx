import { Metadata } from 'next'
import { generateToolMetadata } from '@/lib/metadata-generator'
import { toolMetadata } from '@/lib/tool-metadata'
import PaintClient from './client'

export const metadata: Metadata = generateToolMetadata({
  ...toolMetadata['paint'],
  category: 'calculators/paint'
})

export default function PaintPage() {
  return <PaintClient />
}
