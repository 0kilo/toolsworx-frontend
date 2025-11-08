import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3010'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
      console.log("------------MEDIA CONVERT: ", formData);
    const response = await axios.post(`${BACKEND_URL}/api/media/convert`, formData)
    
    return NextResponse.json(response.data, { status: response.status })
  } catch (error) {
    console.error('Media conversion error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}