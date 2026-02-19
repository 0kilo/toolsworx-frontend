import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AccountPage() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle>Account Temporarily Disabled</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            Account and API key management are disabled while backend services are offline.
          </p>
          <Link href="/" className="underline underline-offset-4 font-medium text-foreground">
            Go to homepage
          </Link>
        </CardContent>
      </Card>
      {/* Previous behavior intentionally disabled: redirect("/account/api-keys") */}
    </main>
  )
}
