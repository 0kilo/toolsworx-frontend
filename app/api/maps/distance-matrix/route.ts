import { NextRequest, NextResponse } from "next/server"

interface DistanceMatrixBody {
  origins?: string
  destinations?: string
  mode?: string
  units?: string
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as DistanceMatrixBody
    const origins = (body.origins || "").trim()
    const destinations = (body.destinations || "").trim()
    const mode = (body.mode || "driving").trim()
    const units = (body.units || "metric").trim()

    if (!origins || !destinations) {
      return NextResponse.json({ error: "origins and destinations are required" }, { status: 400 })
    }

    const key = process.env.GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    if (!key) {
      return NextResponse.json({ error: "Google Maps API key is not configured on server" }, { status: 400 })
    }

    const params = new URLSearchParams({
      origins,
      destinations,
      mode,
      units,
      key,
    })

    const googleRes = await fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?${params.toString()}`)
    const googleData = await googleRes.json()

    if (!googleRes.ok) {
      return NextResponse.json(
        { error: "Google Distance Matrix request failed", details: googleData },
        { status: googleRes.status }
      )
    }

    return NextResponse.json(googleData)
  } catch (error) {
    console.error("distance-matrix proxy error:", error)
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 })
  }
}

