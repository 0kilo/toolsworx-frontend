 "use client"

import { ApiKeysManager } from "@/components/account/api-keys-manager"

export default function ApiKeysPage() {
  return (
    <main className="container mx-auto max-w-4xl px-4 py-12">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">API Keys</h1>
          <p className="mt-2 text-muted-foreground">
            Generate and manage API keys for MCP access to Tools Worx services.
          </p>
        </div>
        <ApiKeysManager />
      </div>
    </main>
  )
}
