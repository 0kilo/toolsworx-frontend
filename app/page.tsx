"use client"

import { allConverters as converters } from "@/lib/registry"
import { categoryGroups } from "@/lib/categories"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { FeaturedCategoryCard } from "@/components/shared/featured-category-card"
import { ToolsDirectory } from "@/components/shared/tools-directory"



export default function HomePage() {
  const categoryPathOverrides: Record<string, string> = {
    "developer-tools": "/dev-tools",
  }

  const cheatsheetPathOverrides: Record<string, string> = {
    "developer-tools": "/developer-tools-cheatsheet",
  }

  return (
    <div className="container py-8 md:py-12">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4 sm:text-5xl md:text-6xl">
          Free Online Conversion Tools
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          Convert documents, images, videos, and units instantly. Fast, secure, and completely free.
        </p>
        <div className="text-sm text-muted-foreground max-w-2xl mx-auto mb-6">
          <Link href="/about" className="underline underline-offset-4">Learn more about Tools Worx</Link>.
        </div>
      </section>

      {/* Converters Section - Popular Only */}
      <section id="converters" className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Popular Converters</h2>

        {categoryGroups.map((group) => {
          const groupConverters = converters.filter((c) =>
            group.categories.includes(c.category) && c.popular
          )

          if (groupConverters.length === 0) return null
          const categoryPath = categoryPathOverrides[group.id] || `/${group.id}`
          const cheatsheetPath = cheatsheetPathOverrides[group.id] || `/${group.id}-cheatsheet`

          return (
            <div key={group.id} className="mb-12">
              <FeaturedCategoryCard
                group={group}
                converters={groupConverters}
                categoryPath={categoryPath}
                cheatsheetPath={cheatsheetPath}
                maxCards={4}
              />
            </div>
          )
        })}
      </section>

      <ToolsDirectory categoryPathOverrides={categoryPathOverrides} />

      <section id="about" className="mb-16">
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold mb-4">About Our Conversion Tools</h2>
            <p className="text-lg text-muted-foreground mb-6">
              We provide fast, and completely free conversion tools for all your needs.
              Whether you need to convert documents, images, videos, or units of measurement,
              we&apos;ve got you covered.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 text-primary">✓</div>
                <div>
                  <h4 className="font-semibold mb-1">100% Free</h4>
                  <p className="text-sm text-muted-foreground">
                    No registration or payment required
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 text-primary">✓</div>
                <div>
                  <h4 className="font-semibold mb-1">Privacy Focused</h4>
                  <p className="text-sm text-muted-foreground">
                    Files automatically deleted after conversion
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 text-primary">✓</div>
                <div>
                  <h4 className="font-semibold mb-1">Fast & Accurate</h4>
                  <p className="text-sm text-muted-foreground">
                    Powered by industry-standard libraries
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 text-primary">✓</div>
                <div>
                  <h4 className="font-semibold mb-1">Mobile Friendly</h4>
                  <p className="text-sm text-muted-foreground">
                    Works perfectly on all devices
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <Link href="/about" className="underline underline-offset-4 font-semibold text-primary">
                Read the story behind Tools Worx
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
