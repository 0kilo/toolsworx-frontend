import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { ConverterMetadata } from "@/types/converter"

interface CategorySidebarProps {
  steps: string[]
  ctaLabel: string
  ctaHref: string
  popularTools?: ConverterMetadata[]
}

export function CategorySidebar({ steps, ctaLabel, ctaHref, popularTools = [] }: CategorySidebarProps) {
  return (
    <aside className="space-y-6">
      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="text-lg font-semibold">Quick start</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
            {steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <Link href={ctaHref} className="text-sm font-semibold underline underline-offset-4">
            {ctaLabel} →
          </Link>
        </CardContent>
      </Card>

      {popularTools.length > 0 && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="text-lg font-semibold">Popular tools</h3>
            <ul className="space-y-2 text-sm">
              {popularTools.map((tool) => (
                <li key={tool.id}>
                  <Link href={tool.href} className="text-sm font-medium underline underline-offset-4">
                    {tool.title}
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </aside>
  )
}
