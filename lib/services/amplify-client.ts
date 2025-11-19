import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';

const client = generateClient<Schema>();

export interface ConversionJob {
  id: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress?: number
  downloadUrl?: string
  error?: string
}

class AmplifyApiClient {
  private token: string | null = null

  setToken(token: string) {
    this.token = token
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token)
    }
  }

  clearToken() {
    this.token = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
    }
  }

  loadToken() {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token')
      if (token) {
        this.token = token
      }
    }
  }

  async convertFile(file: File, targetFormat: string, options?: any): Promise<ConversionJob> {
    const fileBuffer = await file.arrayBuffer()
    const base64Data = Buffer.from(fileBuffer).toString('base64')

    const { data } = await client.queries.fileConversion({
      fileData: base64Data,
      fileName: file.name,
      targetFormat,
      options
    })

    if (!data) {
      throw new Error('Conversion failed - no response from server')
    }

    return {
      id: crypto.randomUUID(),
      status: 'completed',
      progress: 100,
      downloadUrl: (data as any).downloadUrl
    }
  }

  async getFileJobStatus(jobId: string): Promise<ConversionJob> {
    return {
      id: jobId,
      status: 'completed',
      progress: 100,
      downloadUrl: ''
    }
  }

  async getMediaJobStatus(jobId: string): Promise<ConversionJob> {
    return {
      id: jobId,
      status: 'completed',
      progress: 100,
      downloadUrl: ''
    }
  }

  async downloadFileJob(jobId: string): Promise<Blob> {
    // Since we store the data URL directly, convert it back to blob
    const job = this.completedJobs.get(jobId)
    if (!job?.downloadUrl) {
      throw new Error('Job not found or no download URL')
    }
    
    const response = await fetch(job.downloadUrl)
    return response.blob()
  }

  private completedJobs = new Map<string, ConversionJob>()

  async downloadMediaJob(jobId: string): Promise<Blob> {
    return new Blob()
  }

  async convertMedia(file: File, targetFormat: string, options?: any): Promise<ConversionJob> {
    const jobId = crypto.randomUUID()
    const fileBuffer = await file.arrayBuffer()
    const base64Data = Buffer.from(fileBuffer).toString('base64')

    const { data } = await client.queries.mediaConversion({
      jobId,
      fileData: base64Data,
      fileName: file.name,
      targetFormat,
      options
    })

    const job = {
      id: jobId,
      status: 'completed' as const,
      progress: 100,
      downloadUrl: (data as any).downloadUrl
    }
    
    this.completedJobs.set(job.id, job)
    return job
  }

  async applyFilter(file: File, filterType: string, options?: any): Promise<ConversionJob> {
    const jobId = crypto.randomUUID()
    const fileBuffer = await file.arrayBuffer()
    const base64Data = Buffer.from(fileBuffer).toString('base64')

    const { data } = await client.queries.fileFilter({
      jobId,
      fileData: base64Data,
      fileName: file.name,
      options: { type: filterType, ...options }
    })

    const job = {
      id: jobId,
      status: 'completed' as const,
      progress: 100,
      downloadUrl: (data as any).downloadUrl
    }
    
    this.completedJobs.set(job.id, job)
    return job
  }

  async request<T = any>(config: any): Promise<any> {
    return { data: null }
  }
}

export const amplifyApiClient = new AmplifyApiClient()

if (typeof window !== 'undefined') {
  amplifyApiClient.loadToken()
}