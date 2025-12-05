import Link from "next/link"
import { siteConfig } from "@/config/site"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © {currentYear} {siteConfig.name}. All rights reserved.
          </p>
        </div>
        <div className="flex gap-4">
          <Link
            href="/privacy"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Terms
          </Link>
          <Link
            href="/contact"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Contact
          </Link>
          <Link
            href="/content-policy"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Content Policy
          </Link>
        </div>
      </div>
    </footer>
  )
}
