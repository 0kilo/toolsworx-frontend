import { NextRequest, NextResponse } from 'next/server'

const FILE_SERVICE_URL = process.env.FILE_SERVICE_URL || 'http://localhost:3000'

export async function GET(
  request: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    const { jobId } = params
    
    const response = await fetch(`${FILE_SERVICE_URL}/api/status/${jobId}`, {
      headers: {
        ...(request.headers.get('authorization') && {
          authorization: request.headers.get('authorization')!
        })
      }
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