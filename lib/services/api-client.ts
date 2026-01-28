export interface ConversionJob {
  id: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress?: number
  downloadUrl?: string
  error?: string
}

type Json = Record<string, any>

const BASE_URL =
  process.env.NEXT_PUBLIC_CONVERTER_API_URL ||
  'https://unified-service-905466639122.us-east5.run.app'
const API_KEY = process.env.NEXT_PUBLIC_CONVERTER_API_KEY || ''

async function http<T = any>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      ...(init.headers || {}),
      ...(API_KEY ? { 'x-api-key': API_KEY } : {}),
    },
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `Request failed: ${res.status}`)
  }
  return res.json()
}

export class ApiClient {
  async getCurrencyRate(currency: string): Promise<Json> {
    const data = await http<{ rates: any[] }>('/api/rates/currency')
    return data.rates?.find((r) => r.currency?.toUpperCase() === currency.toUpperCase())
  }

  async getCryptoPrice(symbol: string): Promise<Json> {
    const data = await http<{ prices: any[] }>('/api/rates/crypto')
    return data.prices?.find((p) => p.symbol?.toUpperCase() === symbol.toUpperCase())
  }

  async convertFile(file: File, targetFormat: string, options?: any): Promise<ConversionJob> {
    const body = new FormData()
    body.append('file', file)
    body.append('targetFormat', targetFormat)
    if (options) {
      if (options.turnstileToken) body.append('turnstileToken', options.turnstileToken)
      body.append('options', JSON.stringify(options))
    }
    const res = await http<{ jobId: string }>('/api/file/convert', { method: 'POST', body })
    return { id: res.jobId, status: 'pending' }
  }

  async convertMedia(file: File, targetFormat: string, options?: any): Promise<ConversionJob> {
    const body = new FormData()
    body.append('file', file)
    body.append('targetFormat', targetFormat)
    if (options) {
      if (options.turnstileToken) body.append('turnstileToken', options.turnstileToken)
      body.append('options', JSON.stringify(options))
    }
    const res = await http<{ jobId: string }>('/api/media/convert', { method: 'POST', body })
    return { id: res.jobId, status: 'pending' }
  }

  async applyFilter(file: File, filterType: string, options?: any): Promise<ConversionJob> {
    const body = new FormData()
    body.append('file', file)
    body.append('filterType', filterType)
    if (options) body.append('filters', JSON.stringify([{ type: filterType, ...options }]))
    const res = await http<{ jobId: string }>('/api/filter', { method: 'POST', body })
    return { id: res.jobId, status: 'pending' }
  }

  async applyAudioFilter(file: File, filterType: string, options?: any): Promise<ConversionJob> {
    const body = new FormData()
    body.append('file', file)
    body.append('filterType', filterType)
    if (options) body.append('options', JSON.stringify(options))
    const res = await http<{ jobId: string }>('/api/audio/filter', { method: 'POST', body })
    return { id: res.jobId, status: 'pending' }
  }

  async getJobStatus(kind: 'file' | 'media' | 'filter' | 'audio', jobId: string): Promise<ConversionJob> {
    const path =
      kind === 'file'
        ? `/api/file/status/${jobId}`
        : kind === 'media'
        ? `/api/media/status/${jobId}`
        : kind === 'filter'
        ? `/api/filter/status/${jobId}`
        : `/api/audio/status/${jobId}`
    const data = await http<{ status: string; progress?: number; downloadUrl?: string }>(path)
    return {
      id: jobId,
      status: mapStatus(data.status),
      progress: data.progress,
      downloadUrl: data.downloadUrl,
    }
  }

  async download(job: ConversionJob): Promise<Blob> {
    if (!job.downloadUrl) throw new Error('No download URL')
    const res = await fetch(`${BASE_URL}${job.downloadUrl}`, {
      headers: API_KEY ? { 'x-api-key': API_KEY } : {},
    })
    if (!res.ok) throw new Error(`Download failed: ${res.status}`)
    return res.blob()
  }
}

function mapStatus(state: string): ConversionJob['status'] {
  switch (state) {
    case 'completed':
    case 'succeeded':
      return 'completed'
    case 'failed':
    case 'error':
      return 'failed'
    case 'waiting':
    case 'queued':
    case 'delayed':
    case 'active':
      return 'processing'
    default:
      return 'pending'
  }
}

export const apiClient = new ApiClient()
