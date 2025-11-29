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
  private completedJobs = new Map<string, ConversionJob>()

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
    const jobId = crypto.randomUUID()
    const fileBuffer = await file.arrayBuffer()
    const base64Data = Buffer.from(fileBuffer).toString('base64')

    const { data, errors } = await client.queries.fileConversion({
      fileData: base64Data,
      fileName: file.name,
      targetFormat,
      options
    },
      {
        authMode: 'apiKey',
      })

    if (errors && errors.length > 0) {
      console.error('File conversion errors:', errors)
      throw new Error(`Conversion failed: ${errors[0].message}`)
    }

    if (!data) {
      throw new Error('Conversion failed - no response from server')
    }

    let responseData = data as any

    // GraphQL returns JSON as a string, need to parse it
    if (typeof responseData === 'string') {
      responseData = JSON.parse(responseData)
    }

    if (!responseData.downloadUrl) {
      console.error('Invalid response from Lambda:', responseData)
      throw new Error('Conversion failed - no download URL in response')
    }

    const job = {
      id: jobId,
      status: 'completed' as const,
      progress: 100,
      downloadUrl: responseData.downloadUrl
    }

    this.completedJobs.set(job.id, job)
    return job
  }

  async getFileJobStatus(jobId: string): Promise<ConversionJob> {
    const job = this.completedJobs.get(jobId)
    if (!job) {
      throw new Error('Job not found')
    }
    return job
  }

  async getMediaJobStatus(jobId: string): Promise<ConversionJob> {
    const job = this.completedJobs.get(jobId)
    if (!job) {
      throw new Error('Job not found')
    }
    return job
  }

  async downloadFileJob(jobId: string): Promise<Blob> {
    const job = this.completedJobs.get(jobId)
    if (!job?.downloadUrl) {
      throw new Error('Job not found or no download URL')
    }

    const response = await fetch(job.downloadUrl)
    return response.blob()
  }

  async downloadMediaJob(jobId: string): Promise<Blob> {
    const job = this.completedJobs.get(jobId)
    if (!job?.downloadUrl) {
      throw new Error('Job not found or no download URL')
    }

    const response = await fetch(job.downloadUrl)
    return response.blob()
  }

  async convertMedia(file: File, targetFormat: string, options?: any): Promise<ConversionJob> {
    const jobId = crypto.randomUUID()
    const fileBuffer = await file.arrayBuffer()
    const base64Data = Buffer.from(fileBuffer).toString('base64')

    const { data, errors } = await client.queries.mediaConversion({
      jobId,
      fileData: base64Data,
      fileName: file.name,
      targetFormat,
      options
    },
      {
        authMode: 'apiKey',
      })

    if (errors && errors.length > 0) {
      console.error('Media conversion errors:', errors)
      throw new Error(`Conversion failed: ${errors[0].message}`)
    }

    if (!data) {
      throw new Error('Conversion failed - no response from server')
    }

    // console.log('Raw media response:', data)
    // console.log('Type of response:', typeof data)
    let responseData = data as any

    // GraphQL returns JSON as a string, need to parse it
    if (typeof responseData === 'string') {
      responseData = JSON.parse(responseData)
    }

    // The response might be wrapped - check for downloadUrl at different levels
    const actualResponse = responseData.downloadUrl ? responseData : (responseData.data || responseData)

    if (!actualResponse || !actualResponse.downloadUrl) {
      console.error('Invalid response from Lambda:', responseData)
      throw new Error('Conversion failed - no download URL in response')
    }

    const job = {
      id: jobId,
      status: 'completed' as const,
      progress: 100,
      downloadUrl: actualResponse.downloadUrl
    }

    this.completedJobs.set(job.id, job)
    return job
  }

  async applyFilter(file: File, filterType: string, options?: any): Promise<ConversionJob> {
    const jobId = crypto.randomUUID()
    const fileBuffer = await file.arrayBuffer()
    const base64Data = Buffer.from(fileBuffer).toString('base64')

    const { data, errors } = await client.queries.fileFilter({
      jobId,
      fileData: base64Data,
      fileName: file.name,
      options: { type: filterType, ...options }
    },
      {
        authMode: 'apiKey',
      })

    if (errors && errors.length > 0) {
      console.error('Filter errors:', errors)
      throw new Error(`Filter failed: ${errors[0].message}`)
    }

    if (!data) {
      throw new Error('Filter failed - no response from server')
    }

    let responseData = data as any

    // GraphQL returns JSON as a string, need to parse it
    if (typeof responseData === 'string') {
      responseData = JSON.parse(responseData)
    }

    if (!responseData.downloadUrl) {
      console.error('Invalid response from Lambda:', responseData)
      throw new Error('Filter failed - no download URL in response')
    }

    const job = {
      id: jobId,
      status: 'completed' as const,
      progress: 100,
      downloadUrl: responseData.downloadUrl
    }

    this.completedJobs.set(job.id, job)
    return job
  }

  async applyAudioFilter(file: File, filterType: string, options?: any): Promise<ConversionJob> {
    const jobId = crypto.randomUUID()
    const fileBuffer = await file.arrayBuffer()
    const base64Data = Buffer.from(fileBuffer).toString('base64')

    const { data, errors } = await client.queries.audioFilter({
      jobId,
      fileData: base64Data,
      fileName: file.name,
      filterType,
      options
    },
      {
        authMode: 'apiKey',
      })

    if (errors && errors.length > 0) {
      console.error('Audio filter errors:', errors)
      throw new Error(`Audio filter failed: ${errors[0].message}`)
    }

    if (!data) {
      throw new Error('Audio filter failed - no response from server')
    }

    let responseData = data as any

    // GraphQL returns JSON as a string, need to parse it
    if (typeof responseData === 'string') {
      responseData = JSON.parse(responseData)
    }

    if (!responseData.downloadUrl) {
      console.error('Invalid response from Lambda:', responseData)
      throw new Error('Audio filter failed - no download URL in response')
    }

    const job = {
      id: jobId,
      status: 'completed' as const,
      progress: 100,
      downloadUrl: responseData.downloadUrl
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