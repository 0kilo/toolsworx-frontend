import Link from "next/link"
import { siteConfig } from "@/config/site"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { categoryGroups } from "@/lib/categories"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">{siteConfig.name}</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            {categoryGroups.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.id}`}
                className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {category.title}
              </Link>
            ))}
          </nav>
        </div>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </div>
    </header>
  )
}
