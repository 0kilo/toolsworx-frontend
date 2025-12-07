import { UnifiedTextProcessor } from "../unified-text-processor"
import { Card, CardContent } from "@/components/ui/card"

export default function TextprocessorClient() {
  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Text Processor & Data Tools</h1>
            <p className="text-muted-foreground">
              Extract data, format code, and transform text with powerful processing tools
            </p>
          </div>

          <UnifiedTextProcessor />

          <Card className="mt-8">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Available Operations</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h3 className="font-semibold mb-2">Data Extraction</h3>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Extract Emails - Find all email addresses</li>
                    <li>• Extract URLs - Find all web links</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Text Case</h3>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• UPPERCASE - All caps</li>
                    <li>• lowercase - All lowercase</li>
                    <li>• Title Case - Capitalize Words</li>
                    <li>• camelCase - Programming style</li>
                    <li>• snake_case - Underscore style</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Code Formatting</h3>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Format JSON - Pretty print JSON</li>
                    <li>• Minify JSON - Compress JSON</li>
                    <li>• Format XML - Indent XML</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Data Cleaning</h3>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Clean CSV - Remove extra spaces</li>
                    <li>• Trim whitespace</li>
                    <li>• Remove empty lines</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1"></div>
      </div>
    </div>
  )
}
