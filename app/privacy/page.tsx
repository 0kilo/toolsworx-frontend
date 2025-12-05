import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy | TOOLS WORX",
  description: "Privacy policy and data protection information for TOOLS WORX online conversion tools and calculators.",
}

export default function PrivacyPage() {
  return (
    <div className="container py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>1. Information We Collect</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <h4>Files You Upload</h4>
            <p>
              When you use our conversion tools, you upload files that are processed temporarily on our servers. These files are automatically deleted after processing is complete.
            </p>
            
            <h4>Usage Information</h4>
            <p>We may collect:</p>
            <ul>
              <li>IP address and browser information</li>
              <li>Pages visited and features used</li>
              <li>File types and sizes processed (not content)</li>
              <li>Error logs for service improvement</li>
            </ul>

            <h4>Cookies and Analytics</h4>
            <p>
              We use cookies and analytics services to understand how our service is used and to improve user experience.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. How We Use Your Information</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p>We use collected information to:</p>
            <ul>
              <li>Provide file conversion and processing services</li>
              <li>Improve our tools and user experience</li>
              <li>Monitor service performance and security</li>
              <li>Comply with legal obligations</li>
            </ul>
            <p>
              <strong>We do not:</strong> Sell, rent, or share your personal information with third parties for marketing purposes.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. File Processing and Storage</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <h4>Temporary Processing</h4>
            <p>
              Files uploaded for conversion are processed in temporary storage and automatically deleted within 24 hours or immediately after processing, whichever comes first.
            </p>
            
            <h4>No Permanent Storage</h4>
            <p>
              We do not permanently store your files or their content. Our systems are designed to process and delete files automatically.
            </p>

            <h4>Content Monitoring</h4>
            <p>
              We may scan uploaded files for malicious content, viruses, and policy violations to protect our service and users. Files violating our content policy will be rejected.
            </p>

            <h4>Security Measures</h4>
            <p>
              All file processing occurs on secure, encrypted servers with restricted access.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Third-Party Services</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p>We may use third-party services for:</p>
            <ul>
              <li><strong>Analytics:</strong> Google Analytics to understand usage patterns</li>
              <li><strong>Advertising:</strong> Google AdSense for displaying relevant ads</li>
              <li><strong>Infrastructure:</strong> AWS for secure file processing</li>
            </ul>
            <p>
              These services have their own privacy policies and may collect information according to their terms.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>5. Data Retention</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <ul>
              <li><strong>Uploaded Files:</strong> Deleted immediately after processing</li>
              <li><strong>Usage Logs:</strong> Retained for 30 days for security and performance monitoring</li>
              <li><strong>Analytics Data:</strong> Aggregated and anonymized data may be retained longer</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>6. Your Rights</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p>You have the right to:</p>
            <ul>
              <li>Know what personal information we collect</li>
              <li>Request deletion of your personal information</li>
              <li>Opt-out of analytics tracking</li>
              <li>Contact us with privacy concerns</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>7. Cookies Policy</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p>We use cookies for:</p>
            <ul>
              <li><strong>Essential:</strong> Basic site functionality</li>
              <li><strong>Analytics:</strong> Understanding usage patterns</li>
              <li><strong>Advertising:</strong> Displaying relevant ads</li>
            </ul>
            <p>
              You can control cookies through your browser settings.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>8. International Users</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p>
              Our services are hosted in the United States. By using our service, you consent to the transfer of your information to the US, which may have different privacy laws than your country.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>9. Changes to Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p>
              We may update this privacy policy from time to time. We will notify users of any material changes by posting the new policy on this page.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>10. Contact Us</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p>
              If you have questions about this privacy policy or our data practices, please contact us through our contact form.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}