import { Metadata } from 'next'
import { generateToolMetadata } from '@/lib/metadata-generator'
import { toolMetadata } from '@/lib/tool-metadata'
import BmiClient from './client'

export const metadata: Metadata = generateToolMetadata({
  ...toolMetadata['bmi'],
  category: 'calculators/bmi'
})

export default function BmiPage() {
  return <BmiClient />
}
