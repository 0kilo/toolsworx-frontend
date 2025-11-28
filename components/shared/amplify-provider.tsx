'use client'

import { Amplify } from 'aws-amplify'
import { useEffect } from 'react'

let amplifyConfigured = false

export function AmplifyProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (amplifyConfigured) return

    async function configureAmplify() {
      try {
        const outputs = await fetch('/amplify_outputs.json').then(res => res.json())
        Amplify.configure(outputs, { ssr: true })
        amplifyConfigured = true
      } catch (e) {
        console.error('❌ Amplify config failed:', e)
      }
    }

    configureAmplify()
  }, [])

  return <>{children}</>
}