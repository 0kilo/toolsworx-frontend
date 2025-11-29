import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service | TOOLS WORX",
  description: "Terms of service and usage agreement for TOOLS WORX online conversion tools and calculators.",
}

export default function TermsPage() {
  return (
    <div className="container py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
        <p className="text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>1. Acceptance of Terms</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p>
              By accessing and using TOOLS WORX ("the Service"), you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Use License</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p>
              Permission is granted to temporarily use the Service for personal, non-commercial transitory viewing only. This includes:
            </p>
            <ul>
              <li>Converting files using our online tools</li>
              <li>Downloading converted files for personal use</li>
              <li>Accessing calculators and utilities</li>
            </ul>
            <p>This license shall automatically terminate if you violate any of these restrictions.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. File Processing and Privacy</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p>
              We process your files to provide conversion services. Important points:
            </p>
            <ul>
              <li>Files are processed temporarily and automatically deleted</li>
              <li>We do not store or retain your files after processing</li>
              <li>All processing happens on secure servers</li>
              <li>You retain all rights to your uploaded content</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Prohibited Uses</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p>You may not use the Service:</p>
            <ul>
              <li>For any unlawful purpose or to solicit others to unlawful acts</li>
              <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
              <li>To upload malicious code, viruses, or harmful content</li>
              <li>To attempt to gain unauthorized access to our systems</li>
              <li>For commercial purposes without explicit permission</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>5. Service Availability</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p>
              We strive to maintain high availability but do not guarantee uninterrupted service. We reserve the right to:
            </p>
            <ul>
              <li>Modify or discontinue the service with or without notice</li>
              <li>Implement usage limits to ensure fair access</li>
              <li>Perform maintenance that may temporarily affect availability</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>6. Disclaimer</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p>
              The Service is provided "as is" without any representations or warranties. We do not warrant that:
            </p>
            <ul>
              <li>The service will meet your specific requirements</li>
              <li>The service will be uninterrupted, timely, secure, or error-free</li>
              <li>The results obtained from the service will be accurate or reliable</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>7. Limitations</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p>
              In no event shall TOOLS WORX or its suppliers be liable for any damages arising out of the use or inability to use the Service.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>8. Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p>
              If you have any questions about these Terms of Service, please contact us through our contact form.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}