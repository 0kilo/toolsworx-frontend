'use client'

import { Amplify } from 'aws-amplify'
import { useEffect } from 'react'

export function AmplifyProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    try {
      const outputs = require('../../amplify_outputs.json')
      Amplify.configure(outputs)
    } catch (e) {
      console.log('Amplify outputs not found')
    }
  }, [])

  return <>{children}</>
}