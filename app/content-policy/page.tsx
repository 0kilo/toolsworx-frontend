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
          Guidelines for acceptable content and usage
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
              <li>Copyrighted material without proper authorization</li>
              <li>Adult content, pornography, or sexually explicit material</li>
              <li>Violence, hate speech, or discriminatory content</li>
              <li>Illegal content or content promoting illegal activities</li>
              <li>Malware, viruses, or malicious code</li>
              <li>Personal information of others without consent</li>
              <li>Spam or misleading content</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Acceptable Use</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p>Our tools are designed for legitimate conversion needs:</p>
            <ul>
              <li>Personal documents and files</li>
              <li>Educational materials</li>
              <li>Business documents (with proper rights)</li>
              <li>Creative content you own or have permission to use</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Enforcement</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p>
              We reserve the right to refuse service, terminate access, or report violations to appropriate authorities.
              Users are responsible for ensuring their content complies with all applicable laws and regulations.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}