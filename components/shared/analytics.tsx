"use client"

import { useEffect } from "react"
import Script from "next/script"

export function Analytics() {
  useEffect(() => {
    const existing = Array.from(document.querySelectorAll('script')).find((s) =>
      s.src?.includes('pagead2.googlesyndication.com/pagead/js/adsbygoogle.js')
    )
    if (existing) return

    const script = document.createElement("script")
    script.async = true
    script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8286321884742507"
    script.crossOrigin = "anonymous"
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
