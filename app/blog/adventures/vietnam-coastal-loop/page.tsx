import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Vietnam Coastal Loop: 4 Stops, 6 Days | ToolsWorx Blog",
  description: "Adventure log across Phan Thiet, Bau Trang, Phan Rang, and Ninh Hoa.",
  alternates: { canonical: "/blog/adventures/vietnam-coastal-loop" },
}

export default function VietnamCoastalLoopPost() {
  return (
    <div className="container py-8 md:py-12 max-w-3xl">
      <h1 className="text-4xl font-bold mb-4">Vietnam Coastal Loop: 4 Stops, 6 Days</h1>
      <p className="text-muted-foreground mb-8">Published: 2026-02-22</p>

      <article className="prose prose-neutral max-w-none">
        <p>
          This trip followed a coastal progression from Phan Thiet to Bau Trang, then north to
          Phan Rang and Ninh Hoa. The goal was balanced riding days with sunrise/sunset photo stops.
        </p>
        <h2>Route Snapshot</h2>
        <p>
          Day 1-2: Phan Thiet base. Day 3: Bau Trang dunes check-in. Day 4: Phan Rang overnight.
          Day 5-6: Ninh Hoa transition and recovery.
        </p>
        <h2>Field Notes</h2>
        <ul>
          <li>Early starts reduced heat exposure and traffic friction.</li>
          <li>Fuel planning margin mattered in long sparse segments.</li>
          <li>Weather shifts changed break timing more than route choice.</li>
        </ul>
      </article>
    </div>
  )
}
