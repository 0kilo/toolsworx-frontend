import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import { Fragment } from "react"

export interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  const allItems = [{ label: "Home", href: "/" }, ...items]

  // Generate JSON-LD schema
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: allItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: `https://toolsworx.com${item.href}`,
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <nav aria-label="Breadcrumb" className="mb-4">
        <ol className="flex items-center gap-2 text-sm text-muted-foreground">
          {allItems.map((item, index) => (
            <Fragment key={item.href}>
              {index > 0 && <ChevronRight className="h-4 w-4" />}
              <li>
                {index === allItems.length - 1 ? (
                  <span className="font-medium text-foreground">{item.label}</span>
                ) : (
                  <Link
                    href={item.href}
                    className="hover:text-foreground transition-colors"
                  >
                    {index === 0 ? (
                      <Home className="h-4 w-4" />
                    ) : (
                      item.label
                    )}
                  </Link>
                )}
              </li>
            </Fragment>
          ))}
        </ol>
      </nav>
    </>
  )
}
