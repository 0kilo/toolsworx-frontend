import Link from "next/link"
import { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { generateToolMetadata } from "@/lib/metadata-generator"
import { toolMetadata } from "@/lib/tool-metadata"

export const metadata: Metadata = generateToolMetadata({
  ...toolMetadata["conversion-mcp"],
  title: "Login - ToolsWorx",
  description:
    "Authenticate with ToolsWorx so your MCP agents can convert files and media. Follow the OAuth flow to get started.",
})

export default function LoginPage() {
  return (
    <div className="container py-10 max-w-3xl space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold">ToolsWorx Login</h1>
        <p className="text-sm text-muted-foreground">
          The MCP server requires an authenticated session. Log in once and your client can reuse
          the bearer token for conversions.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>How the flow works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-muted-foreground">
          <ol className="list-decimal list-inside space-y-2">
            <li>Click the button below to open our OAuth sign-in page.</li>
            <li>
              After successful login, we redirect you back with an authentication blob. That
              credentials blob can be used by MCP clients via the `TWX_API_KEY` bearer token env.
            </li>
            <li>Store the bearer token securely and rotate it when needed.</li>
          </ol>
        </CardContent>
      </Card>
      {/* <div className="text-center">
        <Button variant="default" asChild>
          <Link href="/api/auth/login">Open login portal</Link>
        </Button>
      </div> */}
    </div>
  )
}
