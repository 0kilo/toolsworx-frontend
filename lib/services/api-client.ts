import { firestore } from "@/lib/firebase/client"

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
const MARKET_CACHE_TTL_MS = 60 * 1000

const cryptoSymbolToId: Record<string, string> = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  BNB: 'binancecoin',
  XRP: 'ripple',
  ADA: 'cardano',
  DOGE: 'dogecoin',
  SOL: 'solana',
  USDT: 'tether',
  USDC: 'usd-coin',
  TRX: 'tron',
  DOT: 'polkadot',
  MATIC: 'matic-network',
  LTC: 'litecoin',
}

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
  private marketCache: Json | null = null
  private marketCacheFetchedAt = 0

  private async getMarketCache(forceRefresh = false): Promise<Json | null> {
    if (!firestore) {
      throw new Error('Firestore client is not initialized')
    }

    const now = Date.now()
    const hasFreshCache =
      this.marketCache && now - this.marketCacheFetchedAt < MARKET_CACHE_TTL_MS
    if (!forceRefresh && hasFreshCache) {
      return this.marketCache
    }

    const doc = await firestore.collection('market_cache').doc('latest').get()
    if (!doc.exists) {
      this.marketCache = null
      this.marketCacheFetchedAt = now
      return null
    }

    this.marketCache = doc.data() ?? null
    this.marketCacheFetchedAt = now
    return this.marketCache
  }

  async getCurrencyRate(currency: string): Promise<Json> {
    const symbol = currency.toUpperCase()

    if (symbol === 'USD') {
      return { currency: 'USD', price: 1 }
    }

    const cache = await this.getMarketCache()
    const rates = cache?.currency?.conversion_rates as Record<string, number> | undefined
    const price = rates?.[symbol]

    if (typeof price !== 'number') return {}

    return {
      currency: symbol,
      price,
      base: cache?.currency?.base_code ?? 'USD',
      updatedAt: cache?.currencyUpdatedAt ?? cache?.updatedAt ?? null,
    }
  }

  async getCryptoPrice(symbol: string): Promise<Json> {
    const upperSym = symbol.toUpperCase()
    const coinId = cryptoSymbolToId[upperSym] ?? upperSym.toLowerCase()
    const cache = await this.getMarketCache()
    const allCrypto = cache?.crypto as Record<string, any> | undefined
    const entry = allCrypto?.[coinId] ?? allCrypto?.[upperSym.toLowerCase()]
    const price =
      typeof entry === 'number'
        ? entry
        : typeof entry?.usd === 'number'
        ? entry.usd
        : undefined

    if (typeof price !== 'number') return {}

    return {
      symbol: upperSym,
      id: coinId,
      price,
      updatedAt: cache?.cryptoUpdatedAt ?? cache?.updatedAt ?? null,
      all: allCrypto ?? {},
    }
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
