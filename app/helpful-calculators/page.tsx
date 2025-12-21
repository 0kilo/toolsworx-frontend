import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ConverterCard } from "@/components/shared/converter-card"
import { CategoryHero } from "@/components/shared/category-hero"
import { CategorySidebar } from "@/components/shared/category-sidebar"
import { getCategoryGroupById } from "@/lib/categories"
import { allConverters } from "@/lib/registry"
import { ArrowLeft } from "lucide-react"

const category = getCategoryGroupById("helpful-calculators")

export const metadata: Metadata = {
  title: category ? `${category.title} - ToolsWorx` : "Helpful Tools",
  description: category?.longDescription ?? "Practical everyday calculators and utilities.",
  alternates: { canonical: "/helpful-calculators" },
}

export default function HelpfulCalculatorsPage() {
  if (!category) {
    return null
  }

  const tools = allConverters.filter((c) => category.categories.includes(c.category))
  const popularTools = tools.filter((tool) => tool.popular).slice(0, 4)

  return (
    <div className="container py-8 md:py-12">
      <div className="mb-8">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>

      <CategoryHero
        category={category}
        toolCount={tools.length}
        eyebrow="Everyday toolkit"
        chips={[`${tools.length}+ tools`, "Fast setup", "Everyday use"]}
      />

      <section className="mb-10">
        <h2 className="text-3xl font-bold mb-6">
          Available {category.title}
          {tools.length > 0 && ` (${tools.length})`}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((converter) => (
            <ConverterCard key={converter.id} converter={converter} />
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-8">
        <div>
          {category.sections && (
            <section className="mb-8">
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Why Use Our {category.title}?</h2>
                  {category.sections.map((section, idx) => (
                    <div key={idx} className="mb-6">
                      <h3 className="text-lg font-semibold mb-2">{section.title}</h3>
                      <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        {section.bullets.map((bullet, bIdx) => (
                          <li key={bIdx}>{bullet}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </section>
          )}
        </div>

        <CategorySidebar
          steps={[
            "Choose a tool for the task.",
            "Fill in the quick form.",
            "Save or share the output."
          ]}
          ctaLabel="Try Recipe Scaler"
          ctaHref="/helpful-calculators/recipe-scaler"
          popularTools={popularTools}
        />
      </div>
    </div>
  )
}
