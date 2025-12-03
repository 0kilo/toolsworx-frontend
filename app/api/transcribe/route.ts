import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const maxDuration = 300; // 5 minutes

/**
 * Audio Transcription API Route
 * Uses OpenAI Whisper API to transcribe audio files
 * Free tier: 3 transcriptions per 24 hours (enforced client-side)
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const language = formData.get('language') as string | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file size (max 25MB for OpenAI Whisper)
    const maxSize = 25 * 1024 * 1024; // 25MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 25MB limit' },
        { status: 400 }
      );
    }

    // Validate file type
    const validTypes = [
      'audio/mpeg',
      'audio/mp3',
      'audio/wav',
      'audio/flac',
      'audio/m4a',
      'audio/mp4',
      'audio/ogg',
      'audio/webm',
    ];

    if (!validTypes.some(type => file.type.includes(type.split('/')[1]))) {
      return NextResponse.json(
        { error: 'Invalid file type. Supported: MP3, WAV, FLAC, M4A, OGG' },
        { status: 400 }
      );
    }

    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      return NextResponse.json(
        { error: 'Transcription service not configured' },
        { status: 500 }
      );
    }

    // Prepare form data for OpenAI
    const whisperFormData = new FormData();
    whisperFormData.append('file', file);
    whisperFormData.append('model', 'whisper-1');

    if (language) {
      whisperFormData.append('language', language);
    }

    // Call OpenAI Whisper API
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: whisperFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);

      return NextResponse.json(
        { error: 'Transcription failed. Please try again.' },
        { status: response.status }
      );
    }

    const result = await response.json();

    return NextResponse.json({
      text: result.text,
      language: result.language,
      duration: result.duration,
    });

  } catch (error) {
    console.error('Transcription error:', error);
    return NextResponse.json(
      { error: 'An error occurred during transcription' },
      { status: 500 }
    );
  }
}
