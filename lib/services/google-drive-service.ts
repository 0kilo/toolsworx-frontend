declare global {
  interface Window {
    gapi: any
  }
}

export interface GoogleDriveFile {
  id: string
  name: string
  content: string
}

export class GoogleDriveService {
  private static gapi: any = null

  static async initialize(): Promise<void> {
    if (typeof window === 'undefined') return
    
    if (!process.env.NEXT_PUBLIC_GOOGLE_API_KEY || !process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
      throw new Error('Google API credentials not configured')
    }

    return new Promise((resolve, reject) => {
      if (this.gapi) {
        resolve()
        return
      }

      const script = document.createElement('script')
      script.src = 'https://apis.google.com/js/api.js'
      script.onload = () => {
        window.gapi.load('auth2:client', async () => {
          try {
            await window.gapi.client.init({
              apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
              clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
              discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
              scope: 'https://www.googleapis.com/auth/drive.file'
            })
            this.gapi = window.gapi
            resolve()
          } catch (error) {
            reject(error)
          }
        })
      }
      script.onerror = reject
      document.head.appendChild(script)
    })
  }

  static async signIn(): Promise<boolean> {
    try {
      if (!this.gapi) await this.initialize()
      
      const authInstance = this.gapi?.auth2?.getAuthInstance()
      if (!authInstance) return false
      
      if (authInstance.isSignedIn.get()) return true
      
      await authInstance.signIn()
      return true
    } catch (error) {
      console.error('Sign in failed:', error)
      return false
    }
  }

  static async saveChart(data: any, fileName: string): Promise<string | null> {
    if (!await this.signIn()) return null

    try {
      const fileMetadata = {
        name: `${fileName}.json`,
        parents: ['appDataFolder']
      }

      const form = new FormData()
      form.append('metadata', new Blob([JSON.stringify(fileMetadata)], { type: 'application/json' }))
      form.append('file', new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }))

      const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token}`
        },
        body: form
      })

      const result = await response.json()
      return result.id
    } catch (error) {
      console.error('Save failed:', error)
      return null
    }
  }

  static async loadChart(fileId: string): Promise<any | null> {
    try {
      if (!await this.signIn()) {
        throw new Error('Google Drive authentication failed')
      }

      const response = await this.gapi.client.drive.files.get({
        fileId: fileId,
        alt: 'media'
      })
      return JSON.parse(response.body)
    } catch (error) {
      console.error('Load failed:', error)
      throw error
    }
  }

  static generateShareUrl(fileId: string): string {
    return `${window.location.origin}/charts/gantt-chart?drive=${fileId}`
  }
}