import { NextRequest, NextResponse } from 'next/server'

const FILTER_SERVICE_URL = process.env.FILTER_SERVICE_URL || 'http://localhost:3002'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    const response = await fetch(`${FILTER_SERVICE_URL}/api/apply`, {
      method: 'POST',
      body: formData,
      headers: {
        ...(request.headers.get('authorization') && {
          authorization: request.headers.get('authorization')!
        })
      }
    })

    const data = await response.json()
    
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Filter application error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}