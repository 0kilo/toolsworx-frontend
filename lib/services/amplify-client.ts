import { apiClient } from './api-client';

export interface ApiResponse<T = any> {
  data: T
  success: boolean
  message?: string
}

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
    apiClient.setToken(token)
  }

  clearToken() {
    this.token = null
    apiClient.clearToken()
  }

  loadToken() {
    apiClient.loadToken()
  }

  async convertFile(file: File, targetFormat: string, options?: any): Promise<ConversionJob> {
    return apiClient.convertFile(file, targetFormat, options)
  }

  async getFileJobStatus(jobId: string): Promise<ConversionJob> {
    return apiClient.getFileJobStatus(jobId)
  }

  async getMediaJobStatus(jobId: string): Promise<ConversionJob> {
    return apiClient.getMediaJobStatus(jobId)
  }

  async downloadFileJob(jobId: string): Promise<Blob> {
    return apiClient.downloadFileJob(jobId)
  }

  async downloadMediaJob(jobId: string): Promise<Blob> {
    return apiClient.downloadMediaJob(jobId)
  }

  async convertMedia(file: File, targetFormat: string, options?: any): Promise<ConversionJob> {
    return apiClient.convertMedia(file, targetFormat, options)
  }

  async applyFilter(file: File, filterType: string, options?: any): Promise<ConversionJob> {
    return apiClient.applyFilter(file, filterType, options)
  }

  async request<T = any>(config: any): Promise<any> {
    return apiClient.request(config)
  }
}

export const amplifyApiClient = new AmplifyApiClient()

if (typeof window !== 'undefined') {
  amplifyApiClient.loadToken()
}