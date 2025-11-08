import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3010'

export async function GET(
  request: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    const { jobId } = params

    const response = await axios.get(`${BACKEND_URL}/api/media/download/${jobId}`, {
      responseType: 'stream'
    })
    
    return new NextResponse(response.data, {
      headers: {
        'Content-Type': response.headers['content-type'] || 'application/octet-stream',
        'Content-Disposition': response.headers['content-disposition'] || 'attachment'
      }
    })
  } catch (error) {
    console.error('Media download error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}