import { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { getCategoryGroupById, getAllCategoryIds, categoryGroups } from "@/lib/categories"
import { converters } from "@/lib/converters/registry"
import { ConverterCard } from "@/components/converters/converter-card"
import { SidebarAd, InContentAd, FooterAd } from "@/components/ads/ad-unit"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Check } from "lucide-react"

interface CategoryPageProps {
  params: {
    id: string
  }
}

// Generate static params for all categories (for SSG)
export async function generateStaticParams() {
  return getAllCategoryIds().map((id) => ({
    id,
  }))
}

// Generate metadata for SEO
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = getCategoryGroupById(params.id)

  if (!category) {
    return {
      title: "Category Not Found",
    }
  }

  const keywords = category.seoKeywords.join(", ")

  return {
    title: `${category.title} - Free Online ${category.title} Tools`,
    description: category.longDescription,
    keywords,
    openGraph: {
      title: `${category.title} - Free Online Tools`,
      description: category.longDescription,
      type: "website",
      url: `/category/${params.id}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${category.title} - Free Online Tools`,
      description: category.longDescription,
    },
    alternates: {
      canonical: `/category/${params.id}`,
    },
  }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const category = getCategoryGroupById(params.id)

  if (!category) {
    notFound()
  }

  // Get all converters in this category
  const categoryConverters = converters.filter((c) => category.categories.includes(c.category))

  const Icon = category.icon

  // Get related categories (all others)
  const relatedCategories = categoryGroups.filter((g) => g.id !== category.id)

  return (
    <div className="container py-8 md:py-12">
      {/* Breadcrumb */}
      <div className="mb-8">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Hero Section */}
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
                  <p className={`text-lg mb-6 ${category.textColor} opacity-90`}>
                    {category.longDescription}
                  </p>

                  {/* Benefits */}
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

          {/* Tools Grid */}
          <section className="mb-8">
            <h2 className="text-3xl font-bold mb-6">
              Available {category.title}
              {categoryConverters.length > 0 && ` (${categoryConverters.length})`}
            </h2>

            {categoryConverters.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {categoryConverters.map((converter) => (
                  <ConverterCard key={converter.id} converter={converter} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Icon className={`h-16 w-16 mx-auto mb-4 ${category.iconColor} opacity-50`} />
                  <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
                  <p className="text-muted-foreground">
                    We&apos;re working on adding {category.title.toLowerCase()} tools. Check back
                    soon!
                  </p>
                </CardContent>
              </Card>
            )}
          </section>

          {/* In-content Ad */}
          <InContentAd />

          {/* SEO Content Section */}
          <section className="mb-8">
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">
                  Why Use Our {category.title}?
                </h2>
                <div className="prose prose-sm max-w-none">
                  <p className="text-muted-foreground mb-4">
                    Our {category.title.toLowerCase()} are designed to be fast, accurate, and
                    easy to use. Whether you&apos;re a student, professional, or just need quick
                    results, our tools are here to help.
                  </p>
                  <h3 className="text-lg font-semibold mb-2">Key Features:</h3>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
                    <li>100% free to use with no registration required</li>
                    <li>Works on all devices - desktop, tablet, and mobile</li>
                    <li>Instant results with accurate calculations</li>
                    <li>Privacy-focused - no data collection</li>
                    <li>Regular updates with new tools added frequently</li>
                  </ul>
                  <h3 className="text-lg font-semibold mb-2">Popular Uses:</h3>
                  <p className="text-muted-foreground">
                    {category.id === "unit-conversions" &&
                      "Perfect for international travel, cooking, education, engineering, and everyday measurements. Convert between metric and imperial units instantly."}
                    {category.id === "calculators" &&
                      "Ideal for financial planning, health tracking, business calculations, and academic work. Get instant results for complex calculations."}
                    {category.id === "file-converters" &&
                      "Essential for document management, file sharing, and format compatibility. Convert PDFs, Word documents, spreadsheets, and more."}
                    {category.id === "media-converters" &&
                      "Perfect for content creators, web developers, and digital marketers. Optimize images, convert videos, and transform audio files with ease."}
                    {category.id === "developer-tools" &&
                      "Must-have tools for developers, DevOps engineers, and technical professionals. Format code, validate data, and streamline your workflow."}
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Related Categories */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-6">Explore Other Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relatedCategories.slice(0, 4).map((relatedCategory) => {
                const RelatedIcon = relatedCategory.icon
                return (
                  <Link key={relatedCategory.id} href={`/category/${relatedCategory.id}`}>
                    <Card
                      className={`${relatedCategory.color} border-2 cursor-pointer hover:shadow-lg transition-shadow`}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className={`${relatedCategory.iconColor} mt-1`}>
                            <RelatedIcon className="h-8 w-8" />
                          </div>
                          <div>
                            <h3 className={`text-lg font-bold mb-1 ${relatedCategory.textColor}`}>
                              {relatedCategory.title}
                            </h3>
                            <p
                              className={`text-sm ${relatedCategory.textColor} opacity-80`}
                            >
                              {relatedCategory.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </section>

          {/* Footer Ad */}
          <FooterAd />
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <SidebarAd />

            {/* Quick Stats Card */}
            <Card className="mt-6">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Available Tools</p>
                    <p className="text-2xl font-bold">{categoryConverters.length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="text-lg font-semibold text-green-600">All Free</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Privacy</p>
                    <p className="text-lg font-semibold">100% Secure</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Popular Keywords */}
            <Card className="mt-6">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Popular Searches</h3>
                <div className="flex flex-wrap gap-2">
                  {category.seoKeywords.slice(0, 8).map((keyword, index) => (
                    <span
                      key={index}
                      className="text-xs px-3 py-1 bg-muted rounded-full text-muted-foreground"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
