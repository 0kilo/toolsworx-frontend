import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Content Policy | TOOLS WORX",
  description: "Content guidelines and acceptable use policy for TOOLS WORX online conversion tools.",
}

export default function ContentPolicyPage() {
  return (
    <div className="container py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Content Policy</h1>
        <p className="text-muted-foreground">
          Guidelines for acceptable content and usage. Last updated: 2025-12-08.
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Prohibited Content</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p>The following types of content are strictly prohibited:</p>
            <ul>
              <li>Illegal activity or content that promotes it</li>
              <li>Adult, violent, hateful, or harassing content</li>
              <li>Malware, viruses, or attempts to gain unauthorized access</li>
              <li>Misleading, deceptive, or impersonation content</li>
              <li>Copyrighted material without authorization; counterfeit goods</li>
              <li>Personal data of others without consent</li>
              <li>Content that enables cheating, hacking, or bypassing security</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Acceptable Use</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p>Use these tools for lawful purposes only:</p>
            <ul>
              <li>Personal, educational, or business documents you have rights to</li>
              <li>Media and data you own or have permission to process</li>
              <li>Non-sensitive content; avoid uploading secrets, PII, or regulated data</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Enforcement</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p>
              We may refuse service, remove content, or terminate access for violations. Serious abuse may be reported to authorities. Please report policy issues via our <a href="/contact" className="underline">contact form</a>.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
