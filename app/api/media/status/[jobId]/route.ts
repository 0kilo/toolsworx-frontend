import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

const MEDIA_SERVICE_URL = process.env.MEDIA_SERVICE_URL || 'http://localhost:3011'

export async function GET(
  request: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    const { jobId } = params
    
    const response = await axios.get(`${MEDIA_SERVICE_URL}/api/status/${jobId}`)
    
    return NextResponse.json(response.data, { status: response.status })
  } catch (error) {
    console.error('Media status check error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}