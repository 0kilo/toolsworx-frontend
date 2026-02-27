import { Metadata } from 'next'
import { generateToolMetadata } from '@/lib/metadata-generator'
import { toolMetadata } from '@/lib/tool-metadata'
import RouteTimePlannerClient from './client'

export const metadata: Metadata = generateToolMetadata({
  ...toolMetadata['route-time-planner'],
  category: 'adventure/route-time-planner'
})

export default function RouteTimePlannerPage() {
  return <RouteTimePlannerClient />
}
