import { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Login Temporarily Disabled - ToolsWorx",
  description: "Login is temporarily disabled while backend services are offline.",
  robots: {
    index: false,
    follow: false,
  },
}

export default function LoginPage() {
  return (
    <div className="container py-10 max-w-3xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Login Temporarily Disabled</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            Login has been disabled while MCP and backend services are offline.
          </p>
          <p>
            You can continue using all active tools from the homepage.
          </p>
          <Link href="/" className="underline underline-offset-4 font-medium text-foreground">
            Go to homepage
          </Link>
        </CardContent>
      </Card>

      {/* Previous login/MCP content intentionally commented while backend is offline. */}
    </div>
  )
}
