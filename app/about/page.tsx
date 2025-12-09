import Link from "next/link"
import { Metadata } from "next"
import { Card, CardContent } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "About Tools Worx | Why These Tools Exist",
  description:
    "Learn who built Tools Worx, why these converters and calculators exist, and how we keep accuracy, privacy, and usability at the center of the experience.",
}

export default function AboutPage() {
  return (
    <div className="container py-10 max-w-4xl space-y-8">
      <header className="space-y-3 text-center">
        <h1 className="text-4xl font-bold">About Tools Worx</h1>
        <p className="text-muted-foreground">
          Built by a mathematician and computer scientist who tinkers, tests, and ships practical tools for everyday builds.
        </p>
      </header>

      <Card>
        <CardContent className="p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-2">Who's behind this?</h2>
            <p className="text-muted-foreground">
              I'm a builder who loves math, code, and hands-on experiments. I made these tools for my own projects--then decided to share them so others don't have to hunt for reliable converters, calculators, and filters.
            </p>
          </section>

          <div className="border-t border-border/60" />

          <section>
            <h2 className="text-2xl font-semibold mb-2">Why these tools exist</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Central hub: one place for the utilities I kept reopening while prototyping and debugging.</li>
              <li>Accuracy first: math and formatting routines are tested for repeatable outputs.</li>
              <li>Speed: everything is tuned to work fast on mobile and desktop without extra clicks.</li>
              <li>Focus: no fluff--just clear inputs, clear outputs, and helpful guidance on when to use each tool.</li>
            </ul>
          </section>

          <div className="border-t border-border/60" />

          <section>
            <h2 className="text-2xl font-semibold mb-2">How we handle quality</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Formulas and conversions come from well-known standards; results are spot-checked across tools.</li>
              <li>Each tool includes usage tips and related links so you can jump to the right companion utility.</li>
              <li>We avoid scraped or AI-gibberish text--content is written to be genuinely helpful.</li>
            </ul>
          </section>

          <div className="border-t border-border/60" />

          <section>
            <h2 className="text-2xl font-semibold mb-2">Privacy and safety</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Most tools run in your browser; sensitive inputs (code, data, media) stay local whenever possible.</li>
              <li>No malware, adult content, or deceptive claims--these are straightforward utilities.</li>
              <li>For uploads (where needed), keep secrets out of files and use test data when possible.</li>
            </ul>
          </section>

          <div className="border-t border-border/60" />

          <section className="space-y-2">
            <h2 className="text-2xl font-semibold">Get in touch</h2>
            <p className="text-muted-foreground">
              Have feedback or found an issue? Reach out--improving these tools is an ongoing hobby.
            </p>
            <Link href="/contact" className="text-primary underline-offset-4 hover:underline">
              Contact the builder
            </Link>
          </section>
        </CardContent>
      </Card>
    </div>
  )
}
