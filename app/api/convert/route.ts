import { NextRequest, NextResponse } from 'next/server'

const FILE_SERVICE_URL = process.env.FILE_SERVICE_URL || 'http://localhost:3000'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    // Forward request to file conversion service
    const response = await fetch(`${FILE_SERVICE_URL}/api/convert`, {
      method: 'POST',
      body: formData,
      headers: {
        // Forward auth header if present
        ...(request.headers.get('authorization') && {
          authorization: request.headers.get('authorization')!
        })
      }
    })

    const data = await response.json()
    
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('File conversion error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}