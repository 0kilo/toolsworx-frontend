import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ApiKeysPage() {
  return (
    <main className="container mx-auto max-w-4xl px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle>API Keys Temporarily Disabled</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            API key generation and MCP access are disabled while backend services are offline.
          </p>
          <Link href="/" className="underline underline-offset-4 font-medium text-foreground">
            Go to homepage
          </Link>
        </CardContent>
      </Card>
      {/* Previous API key management UI intentionally disabled while backend is offline. */}
    </main>
  )
}
