import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3010'

export async function GET(
  request: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    const { jobId } = params

    const response = await fetch(`${BACKEND_URL}/api/status/${jobId}`, {
      headers: {
        ...(request.headers.get('authorization') && {
          authorization: request.headers.get('authorization')!
        })
      },
      signal: AbortSignal.timeout(30000) // 30 seconds
    })

    const data = await response.json()
    
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Status check error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}