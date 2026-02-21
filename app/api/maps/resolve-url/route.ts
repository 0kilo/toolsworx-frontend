import { NextRequest, NextResponse } from "next/server"

function isAllowedMapsHost(hostname: string): boolean {
  const h = hostname.toLowerCase()
  return (
    h === "maps.app.goo.gl" ||
    h === "goo.gl" ||
    h === "google.com" ||
    h === "www.google.com" ||
    h.endsWith(".google.com")
  )
}

export async function GET(request: NextRequest) {
  const target = request.nextUrl.searchParams.get("url")
  if (!target) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 })
  }

  let parsed: URL
  try {
    parsed = new URL(target)
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 })
  }

  if (!isAllowedMapsHost(parsed.hostname)) {
    return NextResponse.json({ error: "Only Google Maps URLs are allowed" }, { status: 400 })
  }

  try {
    const res = await fetch(parsed.toString(), {
      method: "GET",
      redirect: "follow",
      headers: {
        // Some shortlinks return better redirects with a browser-like UA.
        "user-agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36",
      },
    })

    return NextResponse.json({
      ok: true,
      finalUrl: res.url || parsed.toString(),
    })
  } catch (error) {
    console.error("Map URL resolve error:", error)
    return NextResponse.json({ error: "Failed to resolve map URL" }, { status: 500 })
  }
}

