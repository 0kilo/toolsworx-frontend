import { Metadata } from 'next'
import { generateToolMetadata } from '@/lib/metadata-generator'
import { toolMetadata } from '@/lib/tool-metadata'
import CalorieClient from './client'

export const metadata: Metadata = generateToolMetadata({
  ...toolMetadata['calorie'],
  category: 'calculators/calorie'
})

export default function CaloriePage() {
  return <CalorieClient />
}
