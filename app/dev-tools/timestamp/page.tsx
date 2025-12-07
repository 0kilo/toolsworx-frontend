import { Metadata } from 'next'
import { generateToolMetadata } from '@/lib/metadata-generator'
import { toolMetadata } from '@/lib/tool-metadata'
import TimestampClient from './client'

export const metadata: Metadata = generateToolMetadata({
  ...toolMetadata['timestamp'],
  category: 'dev-tools/timestamp'
})

export default function TimestampPage() {
  return <TimestampClient />
}
