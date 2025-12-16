"use client"

import { useEffect } from "react"
import Script from "next/script"

export function Analytics() {
  useEffect(() => {
    const existing = document.querySelector('script[data-adsbygoogle]')
    if (existing) return

    const script = document.createElement("script")
    script.async = true
    script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8286321884742507"
    script.crossOrigin = "anonymous"
    script.setAttribute("data-adsbygoogle", "true")
    document.head.appendChild(script)
  }, [])

  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-6KELGGJCTR"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-6KELGGJCTR');
        `}
      </Script>
    </>
  )
}
