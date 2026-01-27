export const metadata = {
  title: "API Keys",
  description: "Manage API keys for MCP access."
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
