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
        <section className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-xl font-semibold">How to connect</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Add the ToolsWorx MCP server to your MCP client configuration and supply your API key.
          </p>
          <pre className="mt-4 overflow-x-auto rounded-md bg-muted p-4 text-xs">
{`{
  "mcpServers": {
    "toolsworx": {
      "type": "http",
      "url": "https://unified-service-905466639122.us-east5.run.app/mcp",
      "description": "ToolsWorx conversion MCP server",
      "args": [
        "--api-key", "YOUR_API_KEY_HERE"
      ]
    }
  }
}`}
          </pre>
          <p className="mt-3 text-xs text-muted-foreground">
            Replace <span className="font-mono">YOUR_API_KEY_HERE</span> with the key you generate below.
          </p>
        </section>
        <ApiKeysManager />
      </div>
    </main>
  )
}
