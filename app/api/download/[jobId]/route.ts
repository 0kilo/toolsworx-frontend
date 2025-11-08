import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000'

export async function GET(
  request: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    const { jobId } = params

    const response = await fetch(`${BACKEND_URL}/api/download/${jobId}`, {
      headers: {
        ...(request.headers.get('authorization') && {
          authorization: request.headers.get('authorization')!
        })
      },
      signal: AbortSignal.timeout(60000) // 60 seconds for downloads
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(errorData, { status: response.status })
    }

    // Stream the file response
    const blob = await response.blob()
    
    return new NextResponse(blob, {
      headers: {
        'Content-Type': response.headers.get('content-type') || 'application/octet-stream',
        'Content-Disposition': response.headers.get('content-disposition') || 'attachment',
      }
    })
  } catch (error) {
    console.error('Download error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}