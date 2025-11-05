"use client"

import { useState } from "react"
import { ConverterCard } from "@/components/shared/converter-card"
import { HeaderAd, InContentAd } from "@/components/ads/ad-unit"
import { converters, getPopularConverters } from "@/lib/registry"
import { categoryGroups } from "@/lib/categories"
import { Input } from "@/components/ui/input"
import { Search, Zap } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const popularConverters = getPopularConverters()

  // Filter converters based on search
  const filteredConverters = searchQuery
    ? converters.filter(
        (c) =>
          c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.keywords.some((k) => k.includes(searchQuery.toLowerCase()))
      )
    : null

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

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search converters..."
            className="pl-10 h-12"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </section>

      {/* Top Ad */}
      <HeaderAd />

      {/* Search Results */}
      {searchQuery && (
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">
            Search Results {filteredConverters && `(${filteredConverters.length})`}
          </h2>
          {filteredConverters && filteredConverters.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredConverters.map((converter) => (
                <ConverterCard key={converter.id} converter={converter} />
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <CardContent>
                <p className="text-muted-foreground">
                  No converters found matching &quot;{searchQuery}&quot;
                </p>
              </CardContent>
            </Card>
          )}
        </section>
      )}

      {/* Converters Section - Popular Only */}
      {!searchQuery && (
        <>
          <section id="converters" className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Converters</h2>

            {categoryGroups.map((group) => {
              const groupConverters = converters.filter((c) =>
                group.categories.includes(c.category) && c.popular
              )

              // Skip empty groups
              if (groupConverters.length === 0) return null

              const Icon = group.icon

              return (
                <div key={group.id} className="mb-12">
                  {/* Category Group Header */}
                  <Link href={`/category/${group.id}`}>
                    <Card className={`${group.color} border-2 mb-6 cursor-pointer hover:shadow-lg transition-shadow`}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div className={`${group.iconColor} mt-1`}>
                              <Icon className="h-8 w-8" />
                            </div>
                            <div>
                              <h3 className={`text-2xl font-bold mb-2 ${group.textColor}`}>
                                {group.title}
                              </h3>
                              <p className={`text-sm ${group.textColor} opacity-80`}>
                                {group.description}
                              </p>
                            </div>
                          </div>
                          <div className={`${group.textColor} opacity-60`}>
                            <span className="text-sm font-medium">View All →</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>

                  {/* Converters Grid - Popular Only */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groupConverters.map((converter) => (
                      <ConverterCard key={converter.id} converter={converter} />
                    ))}
                  </div>
                </div>
              )
            })}
          </section>

          {/* Middle Ad */}
          <InContentAd />

          {/* About Section */}
          <section id="about" className="mb-16">
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold mb-4">About Our Conversion Tools</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  We provide fast, accurate, and completely free conversion tools for all your needs.
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
              </CardContent>
            </Card>
          </section>
        </>
      )}
    </div>
  )
}
