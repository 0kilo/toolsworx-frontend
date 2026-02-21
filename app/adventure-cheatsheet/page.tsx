import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Adventure Tools Cheatsheet - Quick Reference",
  description: "Quick reference for route, fuel, budget, packing, and outdoor planning tools.",
  alternates: { canonical: "/adventure-cheatsheet" },
}

export default function AdventureCheatsheetPage() {
  return (
    <div className="container py-8 md:py-12">
      <h1 className="text-4xl font-bold mb-4">Adventure Tools Cheatsheet</h1>
      <p className="text-muted-foreground mb-6">
        Quick reference page is currently a stub. Use the full category view for all tools.
      </p>
      <Link href="/adventure" className="underline underline-offset-4 font-semibold">
        Open Adventure Tools
      </Link>
    </div>
  )
}
