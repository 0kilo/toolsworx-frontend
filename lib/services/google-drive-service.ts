import { google } from 'googleapis';

interface DriveFileResponse {
  data: Buffer
  mimeType: string
  name: string
}

export class GoogleDriveService {
  private drive = google.drive({ version: 'v3' })

  async fetchFileFromUrl(url: string): Promise<DriveFileResponse> {
    const fileId = this.extractFileId(url)
    if (!fileId) {
      throw new Error('Invalid Google Drive URL')
    }

    const [metadata, content] = await Promise.all([
      this.drive.files.get({ fileId }),
      this.drive.files.get({ fileId, alt: 'media' }, { responseType: 'arraybuffer' })
    ])

    return {
      data: Buffer.from(content.data as ArrayBuffer),
      mimeType: metadata.data.mimeType || 'application/octet-stream',
      name: metadata.data.name || 'file'
    }
  }

  private extractFileId(url: string): string | null {
    const patterns = [
      /\/d\/([a-zA-Z0-9-_]+)/,
      /id=([a-zA-Z0-9-_]+)/,
      /file\/d\/([a-zA-Z0-9-_]+)/
    ]

    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) return match[1]
    }
    return null
  }
}
