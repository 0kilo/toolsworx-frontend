import Link from "next/link"
import { categoryGroups } from "@/lib/categories"
import { allConverters } from "@/lib/registry"

interface ToolsDirectoryProps {
  categoryPathOverrides?: Record<string, string>
}

export function ToolsDirectory({ categoryPathOverrides = {} }: ToolsDirectoryProps) {
  const groupsWithTools = categoryGroups
    .map((group) => {
      const tools = allConverters.filter((converter) =>
        group.categories.includes(converter.category as string)
      )
      return { group, tools }
    })
    .filter(({ tools }) => tools.length > 0)

  return (
    <section id="all-tools" className="mb-16">
      <h2 className="text-3xl font-bold mb-3">Browse All Tools</h2>
      <p className="text-muted-foreground mb-8">
        Open a category or jump directly to a tool.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {groupsWithTools.map(({ group, tools }) => {
          const categoryPath = categoryPathOverrides[group.id] || `/${group.id}`

          return (
            <div key={group.id} className="rounded-lg border border-border p-5">
              <div className="mb-4">
                <Link
                  href={categoryPath}
                  className="text-xl font-semibold underline underline-offset-4"
                >
                  {group.title}
                </Link>
                <p className="text-sm text-muted-foreground mt-1">{tools.length} tools</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                {tools.map((tool) => (
                  <Link
                    key={tool.id}
                    href={tool.href}
                    className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4"
                  >
                    {tool.title}
                  </Link>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
