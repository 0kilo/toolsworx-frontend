export const metadata = {
  title: "API Keys Temporarily Disabled",
  description: "API key management is temporarily disabled while backend services are offline.",
  robots: {
    index: false,
    follow: false,
  },
}

export const dynamic = "force-dynamic"

import type { ReactNode } from "react"

export default function ApiKeysLayout({
  children,
}: {
  children: ReactNode
}) {
  return <>{children}</>
}
