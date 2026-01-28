import { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { generateToolMetadata } from "@/lib/metadata-generator"
import { toolMetadata } from "@/lib/tool-metadata"

export const metadata: Metadata = generateToolMetadata({
  ...toolMetadata["conversion-mcp"],
  category: "helpful-calculators/conversion-mcp",
})

export default function ConversionMcpPage() {
  return (
    <div className="container py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Conversion MCP</h1>
        <p className="text-xl text-muted-foreground">
          Connect your AI agents to ToolsWorx conversions through Model Context Protocol (MCP).
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>What it is</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-muted-foreground">
          <p>
            Conversion MCP exposes our conversion endpoints over a secure MCP server so agents can
            convert documents, images, audio, and video without building custom integrations.
          </p>
          <p>
            You’ll need a registered account to request an API key before connecting. Keys let us
            rate-limit usage and keep the service stable for everyone.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>How to connect</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <ol className="list-decimal list-inside space-y-2">
            <li>Sign in and create an API key.</li>
            <li>Configure your MCP client with the ToolsWorx MCP URL.</li>
            <li>Pass your API key in the MCP auth section.</li>
          </ol>
          <pre className="bg-muted p-4 rounded-lg text-xs overflow-auto">
{`{
  "mcpServers": {
    "toolsworx": {
      "type": "http",
      "url": "https://unified-service-905466639122.us-east5.run.app/mcp",
      "description": "ToolsWorx conversion MCP server",
      "auth": {
        "type": "api_key",
        "apiKey": "YOUR_API_KEY"
      }
    }
  }
}`}
          </pre>
          <p className="text-sm">
            Need an API key? Head to your account dashboard below.
          </p>
          <Link href="/account/api-keys">
            <Button>Open API Keys Dashboard</Button>
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>What you can do</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-muted-foreground">
          <ul className="list-disc list-inside space-y-2">
            <li>Convert documents between PDF, DOCX, TXT, and more.</li>
            <li>Transform images, audio, and video formats for downstream workflows.</li>
            <li>Automate conversions inside agent pipelines with consistent tooling.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
