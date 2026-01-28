"use client"

import { useEffect, useRef } from "react"

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, options: any) => string
      reset: (id?: string) => void
    }
  }
}

interface TurnstileProps {
  siteKey: string
  onToken: (token: string) => void
}

export function Turnstile({ siteKey, onToken }: TurnstileProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const widgetIdRef = useRef<string | null>(null)
  const renderedRef = useRef(false)
  const onTokenRef = useRef(onToken)

  useEffect(() => {
    onTokenRef.current = onToken
  }, [onToken])

  useEffect(() => {
    if (!siteKey || !ref.current) return

    const loadScript = () =>
      new Promise<void>((resolve) => {
        if (window.turnstile) return resolve()
        const existing = document.querySelector('script[data-turnstile="true"]')
        if (existing) {
          existing.addEventListener("load", () => resolve())
          return
        }
        const script = document.createElement("script")
        script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        script.async = true
        script.defer = true
        script.dataset.turnstile = "true"
        script.onload = () => resolve()
        document.head.appendChild(script)
      })

    let mounted = true
    loadScript().then(() => {
      if (!mounted || !ref.current || !window.turnstile) return
      if (renderedRef.current) return
      renderedRef.current = true
      const id = window.turnstile.render(ref.current, {
        sitekey: siteKey,
        callback: (token: string) => onTokenRef.current(token),
        "expired-callback": () => onTokenRef.current(""),
        "error-callback": () => onTokenRef.current("")
      })
      widgetIdRef.current = id
    })

    return () => {
      mounted = false
      if (widgetIdRef.current && window.turnstile?.reset) {
        window.turnstile.reset(widgetIdRef.current)
      }
    }
  }, [siteKey])

  return <div ref={ref} />
}
