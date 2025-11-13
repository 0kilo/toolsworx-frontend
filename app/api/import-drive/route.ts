import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { fileId } = await request.json()
    
    if (!fileId) {
      return NextResponse.json({ error: 'File ID is required' }, { status: 400 })
    }

    const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`
    const response = await fetch(downloadUrl)
    
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch file from Google Drive' }, { status: response.status })
    }
    
    const text = await response.text()
    
    try {
      const jsonData = JSON.parse(text)
      return NextResponse.json(jsonData)
    } catch (parseError) {
      return NextResponse.json({ error: 'Invalid JSON file' }, { status: 400 })
    }
    
  } catch (error) {
    console.error('Import error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}