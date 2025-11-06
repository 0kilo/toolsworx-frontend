import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

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

class ApiClient {
  private client: AxiosInstance
  private token: string | null = null

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || '',
      timeout: 300000, // 5 minutes
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Request interceptor - inject JWT token
    this.client.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor - handle auth errors
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.clearToken()
          // Redirect to login if needed
          if (typeof window !== 'undefined') {
            window.location.href = '/login'
          }
        }
        return Promise.reject(error)
      }
    )
  }

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

  // File conversion methods
  async convertFile(file: File, targetFormat: string, options?: any): Promise<ConversionJob> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('targetFormat', targetFormat)
    if (options) {
      formData.append('options', JSON.stringify(options))
    }

    const response = await this.client.post('/api/convert', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    // Backend returns job directly, not wrapped in ApiResponse
    return {
      id: response.data.jobId,
      status: response.data.status,
      progress: 0,
      downloadUrl: response.data.downloadUrl
    }
  }

  async getFileJobStatus(jobId: string): Promise<ConversionJob> {
    const response = await this.client.get(`/api/status/${jobId}`)
    return {
      id: response.data.jobId || jobId,
      status: response.data.status,
      progress: response.data.progress || 0,
      downloadUrl: response.data.downloadUrl,
      error: response.data.error
    }
  }

  async getMediaJobStatus(jobId: string): Promise<ConversionJob> {
    const response = await this.client.get(`/api/media/status/${jobId}`)
    return {
      id: response.data.jobId || jobId,
      status: response.data.status,
      progress: response.data.progress || 0,
      downloadUrl: response.data.downloadUrl,
      error: response.data.error
    }
  }

  async downloadFileJob(jobId: string): Promise<Blob> {
    const response = await this.client.get(`/api/download/${jobId}`, {
      responseType: 'blob',
    })
    return response.data
  }

  async downloadMediaJob(jobId: string): Promise<Blob> {
    const response = await this.client.get(`/api/media/download/${jobId}`, {
      responseType: 'blob',
    })
    return response.data
  }

  // Media conversion methods
  async convertMedia(file: File, targetFormat: string, options?: any): Promise<ConversionJob> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('targetFormat', targetFormat)
    
    if (options) {
      formData.append('options', JSON.stringify(options))
    }

    const response = await this.client.post('/api/media/convert', formData, {
       headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 300000
    })

    // Media service returns job directly, not wrapped in ApiResponse
    return {
      id: response.data.jobId,
      status: response.data.status,
      progress: 0,
      downloadUrl: response.data.downloadUrl
    }
  }

  // Filter methods
  async applyFilter(file: File, filterType: string, options?: any): Promise<ConversionJob> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('filterType', filterType)
    if (options) {
      formData.append('options', JSON.stringify(options))
    }

    const response = await axios.post<ApiResponse<ConversionJob>>(`${process.env.NEXT_PUBLIC_FILTER_SERVICE_URL || 'http://localhost:3012'}/api/filter`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 300000
    })

    return response.data.data
  }

  // Generic request method
  async request<T = any>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.request<T>(config)
  }
}

// Create singleton instance
export const apiClient = new ApiClient()

// Initialize token on client side
if (typeof window !== 'undefined') {
  apiClient.loadToken()
}