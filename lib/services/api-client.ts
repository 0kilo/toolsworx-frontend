export interface ConversionJob {
  id: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress?: number
  downloadUrl?: string
  error?: string
}

type Json = Record<string, any>

export interface StreamConversionResult {
  blob: Blob
  filename?: string
  contentType?: string
}

const BASE_URL = process.env.NEXT_PUBLIC_CONVERTER_API_URL || 'http://localhost:8080'
const API_KEY = process.env.NEXT_PUBLIC_CONVERTER_API_KEY || ''

function buildHeaders(overrides?: HeadersInit) {
  const baseHeaders: Record<string, string> = {}
  if (API_KEY) baseHeaders['x-api-key'] = API_KEY
  if (overrides instanceof Headers) {
    overrides.forEach((value, key) => {
      baseHeaders[key] = value
    })
  } else if (overrides) {
    Object.entries(overrides).forEach(([key, value]) => {
      if (typeof value === 'string') baseHeaders[key] = value
    })
  }
  return baseHeaders
}

async function http<T = any>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: buildHeaders(init.headers),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `Request failed: ${res.status}`)
  }
  return res.json()
}

function parseContentDisposition(header: string | null): string | undefined {
  if (!header) return undefined
  const match = /filename\*?=([^;]+)/i.exec(header)
  if (!match) return undefined
  let filename = match[1].trim()
  if (filename.startsWith("UTF-8''")) {
    filename = filename.replace("UTF-8''", '')
  }
  filename = filename.replace(/['\"]+/g, '')
  return filename
}

async function fetchStream(path: string, init: RequestInit = {}): Promise<StreamConversionResult> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: buildHeaders(init.headers),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `Request failed: ${res.status}`)
  }
  const blob = await res.blob()
  const filename = parseContentDisposition(res.headers.get('content-disposition'))
  const contentType = res.headers.get('content-type') || undefined
  return { blob, filename, contentType }
}

export class ApiClient {
  async getCurrencyRate(currency: string): Promise<Json> {
    const symbol = currency.toUpperCase()
    try {
      const wsRate = await this.getRateOverWebSocket({
        category: 'currency',
        symbol,
      })
      if (wsRate) return wsRate
    } catch (error) {
      console.warn('WebSocket currency rate failed', error)
    }

    const legacy = await this.fetchLegacyCurrency(currency)
    return legacy ?? {}
  }

  async getCryptoPrice(symbol: string): Promise<Json> {
    const upperSym = symbol.toUpperCase()
    try {
      const wsRate = await this.getRateOverWebSocket({
        category: 'crypto',
        symbol: upperSym,
      })
      if (wsRate) return wsRate
    } catch (error) {
      console.warn('WebSocket crypto rate failed', error)
    }

    const legacy = await this.fetchLegacyCrypto(symbol)
    return legacy ?? {}
  }

  private async fetchLegacyCurrency(currency: string): Promise<Json | null> {
    const data = await http<{ rates: any[] }>('/rates/currency')
    return (
      data.rates?.find((r) => r.currency?.toUpperCase() === currency.toUpperCase()) ?? null
    )
  }

  private async fetchLegacyCrypto(symbol: string): Promise<Json | null> {
    const data = await http<{ prices: any[] }>('/rates/crypto')
    return data.prices?.find((p) => p.symbol?.toUpperCase() === symbol.toUpperCase()) ?? null
  }

  private createWebSocketUrl(): string {
    const url = new URL(BASE_URL)
    url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:'
    url.pathname = '/ws/rates'
    return url.toString()
  }

  private async getRateOverWebSocket(params: { category: 'crypto' | 'currency'; symbol: string }): Promise<Json | null> {
    if (typeof window === 'undefined' || typeof window.WebSocket === 'undefined') {
      return null
    }

    return new Promise((resolve, reject) => {
      const ws = new window.WebSocket(this.createWebSocketUrl())
      const symbolUpper = params.symbol.toUpperCase()
      const payload = {
        action: 'getRate',
        category: params.category,
        symbol: symbolUpper,
      }
      const timeout = window.setTimeout(() => {
        ws.close()
        reject(new Error('WebSocket request timed out'))
      }, 10000)

      const cleanup = () => {
        window.clearTimeout(timeout)
        if (ws.readyState === WebSocket.OPEN) {
          ws.close()
        }
      }

      ws.addEventListener('open', () => {
        ws.send(JSON.stringify(payload))
      })

      ws.addEventListener('message', (event) => {
        try {
          const data = JSON.parse(event.data)
          const candidate = this.normalizeRatePayload(data, symbolUpper)
          if (candidate) {
            cleanup()
            resolve(candidate)
          }
        } catch (error) {
          cleanup()
          reject(error)
        }
      })

      ws.addEventListener('error', (event) => {
        cleanup()
        reject(new Error('WebSocket error'))
      })

      ws.addEventListener('close', () => {
        cleanup()
        reject(new Error('WebSocket connection closed before data was received'))
      })
    })
  }

  private normalizeRatePayload(payload: any, symbolUpper: string): Json | null {
    const data = payload?.data ?? payload?.result ?? payload
    const lookups: any[] = []
    if (Array.isArray(data?.rates)) lookups.push(...data.rates)
    if (Array.isArray(data?.prices)) lookups.push(...data.prices)
    if (Array.isArray(data?.values)) lookups.push(...data.values)
    if (lookups.length) {
      const match = lookups.find((entry) => {
        const key = (entry?.symbol || entry?.currency || entry?.id || '')?.toUpperCase()
        return key === symbolUpper
      })
      if (match) return match
    }

    const candidate = data
    const key = (candidate?.symbol || candidate?.currency || '')?.toUpperCase()
    if (key === symbolUpper) {
      return candidate
    }

    return null
  }

  async convertBase64File(
    file: File,
    options?: any
  ): Promise<StreamConversionResult> {
    const body = new FormData()
    body.append('file', file)
    if (options) {
      if (options.turnstileToken) body.append('turnstileToken', options.turnstileToken)
      body.append('options', JSON.stringify(options))
    }
    return fetchStream('/file/encoder', { method: 'POST', body })
  }
  async convertFile(
    file: File,
    sourceFormat: string,
    targetType: string,
    options?: any
  ): Promise<StreamConversionResult> {
    const body = new FormData()
    body.append('file', file)
    body.append('sourceType', sourceFormat)
    body.append('targetType', targetType)
    if (options) {
      if (options.turnstileToken) body.append('turnstileToken', options.turnstileToken)
      body.append('options', JSON.stringify(options))
    }
    return fetchStream('/file/convert', { method: 'POST', body })
  }

  async convertAudio(
    file: File,
    sourceFormat: string,
    targetType: string,
    options?: any
  ): Promise<StreamConversionResult> {
    return this.convertMediaType('/audio/convert', file, sourceFormat, targetType, options)
  }

  async convertImage(
    file: File,
    sourceFormat: string,
    targetType: string,
    options?: any
  ): Promise<StreamConversionResult> {
    return this.convertMediaType('/image/convert', file, sourceFormat, targetType, options)
  }

  async convertVideo(
    file: File,
    sourceFormat: string,
    targetType: string,
    options?: any
  ): Promise<StreamConversionResult> {
    return this.convertMediaType('/video/convert', file, sourceFormat, targetType, options)
  }

  private async convertMediaType(
    path: string,
    file: File,
    sourceFormat: string,
    targetType: string,
    options?: any
  ): Promise<StreamConversionResult> {
    const body = new FormData()
    body.append('file', file)
    body.append('sourceType', sourceFormat)
    body.append('targetType', targetType)
    if (options) {
      if (options.turnstileToken) body.append('turnstileToken', options.turnstileToken)
      body.append('options', JSON.stringify(options))
    }
    return fetchStream(path, { method: 'POST', body })
  }

  async applyFilter(file: File, filterType: string, options?: any): Promise<ConversionJob> {
    const body = new FormData()
    body.append('file', file)
    body.append('filterType', filterType)
    if (options) body.append('filters', JSON.stringify([{ type: filterType, ...options }]))
    const res = await http<{ jobId: string }>('/filter', { method: 'POST', body })
    return { id: res.jobId, status: 'pending' }
  }

  async applyAudioFilter(file: File, filterType: string, options?: any): Promise<ConversionJob> {
    const body = new FormData()
    body.append('file', file)
    body.append('filterType', filterType)
    if (options) body.append('options', JSON.stringify(options))
    const res = await http<{ jobId: string }>('/audio/filter', { method: 'POST', body })
    return { id: res.jobId, status: 'pending' }
  }

  async getJobStatus(kind: 'file' | 'video' | 'image' | 'filter' | 'audio' | 'media', jobId: string): Promise<ConversionJob> {
    const path =
      kind === 'file'
        ? `/file/status/${jobId}`
        : kind === 'video'
        ? `/video/status/${jobId}`
        : kind === 'audio'
        ? `/audio/status/${jobId}`
        : kind === 'image'
        ? `/image/status/${jobId}`
        : `/filter/status/${jobId}`
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

export const convertFile = (file: File, sourceFormat: string, targetType: string, options?: any) =>
  {
    if(targetType === 'base64'){
      return apiClient.convertBase64File(file);
    } else {
      return apiClient.convertFile(file, sourceFormat, targetType, options);
    }

  }

export const convertAudioFile = (file: File, sourceFormat: string, targetType: string, options?: any) =>
  apiClient.convertAudio(file, sourceFormat, targetType, options)

export const convertImageFile = (file: File, sourceFormat: string, targetType: string, options?: any) =>
  apiClient.convertImage(file, sourceFormat, targetType, options)

export const convertVideoFile = (file: File, sourceFormat: string, targetType: string, options?: any) =>
  apiClient.convertVideo(file, sourceFormat, targetType, options)
