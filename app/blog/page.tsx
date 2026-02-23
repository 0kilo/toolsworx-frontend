import { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { blogAdventurePosts, blogApplicationPosts } from "@/lib/categories/blog"
import { getCategoryGroupById } from "@/lib/categories"

const category = getCategoryGroupById("blog")

export const metadata: Metadata = {
  title: category ? `${category.title} - ToolsWorx` : "Blog",
  description: category?.longDescription ?? "Travel logs and real-world tool applications.",
  alternates: { canonical: "/blog" },
}

export default function BlogPage() {
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

      <section className="mb-10">
        <h1 className="text-4xl font-bold mb-3">Blog</h1>
        <p className="text-muted-foreground max-w-3xl">
          Adventures documents the trips. Applications shows how the tools were used in real planning.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Adventures</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogAdventurePosts.map((post) => (
            <Link key={post.id} href={post.href}>
              <Card className="h-full hover:shadow-lg transition-shadow">
                <div className="flex">
                  <div className="flex-1">
                    <CardHeader>
                      <CardTitle>{post.title}</CardTitle>
                      <CardDescription>{post.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {post.publishedAt && (
                        <p className="text-sm text-muted-foreground">Published: {post.publishedAt}</p>
                      )}
                    </CardContent>
                  </div>
                  {post.thumbnail && (
                    <img
                      src={post.thumbnail}
                      alt={post.title}
                      className="w-32 h-full object-cover rounded-r-lg border-l"
                    />
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Application</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogApplicationPosts.map((post) => (
            <Link key={post.id} href={post.href}>
              <Card className="h-full hover:shadow-lg transition-shadow">
                <div className="flex">
                  <div className="flex-1">
                    <CardHeader>
                      <CardTitle>{post.title}</CardTitle>
                      <CardDescription>{post.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {post.publishedAt && (
                        <p className="text-sm text-muted-foreground">Published: {post.publishedAt}</p>
                      )}
                    </CardContent>
                  </div>
                  {post.thumbnail && (
                    <img
                      src={post.thumbnail}
                      alt={post.title}
                      className="w-32 h-full object-cover rounded-r-lg border-l"
                    />
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
