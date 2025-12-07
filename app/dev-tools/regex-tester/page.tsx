import { Metadata } from 'next'
import { generateToolMetadata } from '@/lib/metadata-generator'
import { toolMetadata } from '@/lib/tool-metadata'
import RegextesterClient from './client'

export const metadata: Metadata = generateToolMetadata({
  ...toolMetadata['regex-tester'],
  category: 'dev-tools/regex-tester'
})

export default function RegextesterPage() {
  return <RegextesterClient />
}
