import { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ConverterCard } from "@/components/shared/converter-card"
import { getCategoryGroupById } from "@/lib/categories"
import { allConverters } from "@/lib/registry"
import { ArrowLeft, Check } from "lucide-react"

const category = getCategoryGroupById("filters")

export const metadata: Metadata = {
  title: category ? `${category.title} - ToolsWorx` : "Filters & Effects",
  description: category?.longDescription ?? "Apply audio, image, and data filters online.",
  alternates: { canonical: "/filters" },
}

export default function FiltersPage() {
  if (!category) {
    return null
  }

  const Icon = category.icon
  const tools = allConverters.filter((c) => category.categories.includes(c.category))

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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <Card className={`${category.color} border-2 mb-8`}>
            <CardContent className="p-8">
              <div className="flex items-start gap-6">
                <div className={`${category.iconColor} mt-2`}>
                  <Icon className="h-16 w-16" />
                </div>
                <div className="flex-1">
                  <h1 className={`text-4xl font-bold mb-4 ${category.textColor}`}>
                    {category.title}
                  </h1>
                  <p className={`text-lg mb-6 ${category.textColor} opacity-90 hidden md:block`}>
                    {category.longDescription}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {category.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Check className={`h-5 w-5 mt-0.5 ${category.iconColor}`} />
                        <span className={`text-sm ${category.textColor} opacity-80`}>
                          {benefit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <section className="mb-8">
            <h2 className="text-3xl font-bold mb-6">
              Available {category.title}
              {tools.length > 0 && ` (${tools.length})`}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tools.map((converter) => (
                <ConverterCard key={converter.id} converter={converter} />
              ))}
            </div>
          </section>

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

        <div className="lg:col-span-1" />
      </div>
    </div>
  )
}
