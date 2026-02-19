import { FFmpeg } from '@ffmpeg/ffmpeg'
import { StreamConversionResult } from '@/lib/services/api-client'

type MediaKind = 'audio' | 'image' | 'video'

type StrategyName = 'ffmpeg-wasm' | 'disabled'

const strategyName = (
  process.env.NEXT_PUBLIC_MEDIA_CONVERSION_STRATEGY?.toLowerCase() as StrategyName | undefined
) || 'ffmpeg-wasm'

const wasmMaxMb = Number(process.env.NEXT_PUBLIC_MEDIA_WASM_MAX_MB || '40')
const ffmpegBaseUrl =
  process.env.NEXT_PUBLIC_FFMPEG_BASE_URL ||
  'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/umd'

let ffmpegInstance: FFmpeg | null = null
let ffmpegLoadPromise: Promise<FFmpeg> | null = null

async function toBlobURL(url: string, mimeType: string) {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`)
  }
  const blob = await response.blob()
  return URL.createObjectURL(new Blob([blob], { type: mimeType }))
}

function getMimeType(targetFormat: string) {
  const fmt = targetFormat.toLowerCase()
  const map: Record<string, string> = {
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    flac: 'audio/flac',
    aac: 'audio/aac',
    ogg: 'audio/ogg',
    m4a: 'audio/mp4',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    gif: 'image/gif',
    bmp: 'image/bmp',
    tiff: 'image/tiff',
    tif: 'image/tiff',
    mp4: 'video/mp4',
    avi: 'video/x-msvideo',
    mkv: 'video/x-matroska',
    mov: 'video/quicktime',
    webm: 'video/webm',
    wmv: 'video/x-ms-wmv',
  }
  return map[fmt] || 'application/octet-stream'
}

function extOrFallback(format: string, fallback: string) {
  const value = (format || '').toLowerCase().replace(/[^a-z0-9]/g, '')
  return value || fallback
}

async function getFfmpeg() {
  if (typeof window === 'undefined') {
    throw new Error('WASM conversion only runs in browser')
  }

  if (ffmpegInstance) return ffmpegInstance
  if (ffmpegLoadPromise) return ffmpegLoadPromise

  ffmpegLoadPromise = (async () => {
    const ffmpeg = new FFmpeg()
    const coreURL = await toBlobURL(`${ffmpegBaseUrl}/ffmpeg-core.js`, 'text/javascript')
    const wasmURL = await toBlobURL(`${ffmpegBaseUrl}/ffmpeg-core.wasm`, 'application/wasm')

    try {
      await ffmpeg.load({
        coreURL,
        wasmURL,
      })
    } catch (error: any) {
      const msg = error?.message || String(error)
      throw new Error(
        `Failed to load FFmpeg WASM core from ${ffmpegBaseUrl}. ${msg}`
      )
    }

    ffmpegInstance = ffmpeg
    return ffmpeg
  })()

  return ffmpegLoadPromise
}

async function convertWithFfmpegWasm(
  kind: MediaKind,
  file: File,
  sourceFormat: string,
  targetFormat: string
): Promise<StreamConversionResult> {
  const ffmpeg = await getFfmpeg()
  const inputExt = extOrFallback(sourceFormat, kind)
  const outputExt = extOrFallback(targetFormat, kind)
  const inputName = `input.${inputExt}`
  const outputName = `output.${outputExt}`

  const inputBytes = new Uint8Array(await file.arrayBuffer())
  await ffmpeg.writeFile(inputName, inputBytes)
  const exitCode = await ffmpeg.exec(['-i', inputName, outputName])
  if (exitCode !== 0) {
    throw new Error(`FFmpeg conversion failed with exit code ${exitCode}`)
  }

  const output = await ffmpeg.readFile(outputName)
  await ffmpeg.deleteFile(inputName)
  await ffmpeg.deleteFile(outputName)

  const data =
    typeof output === 'string'
      ? new TextEncoder().encode(output)
      : new Uint8Array(output)
  const blob = new Blob([data], { type: getMimeType(targetFormat) })
  return {
    blob,
    filename: outputName,
    contentType: getMimeType(targetFormat),
  }
}

function shouldUseWasm(file: File) {
  if (typeof window === 'undefined') return false
  if (!Number.isFinite(wasmMaxMb) || wasmMaxMb <= 0) return true
  return file.size <= wasmMaxMb * 1024 * 1024
}

async function convertByStrategy(
  kind: MediaKind,
  file: File,
  sourceFormat: string,
  targetFormat: string,
  _options?: any
) {
  if (strategyName === 'disabled') {
    throw new Error('Conversion is temporarily disabled.')
  }

  const canUseWasm = shouldUseWasm(file)
  if (!canUseWasm) {
    throw new Error(`File too large for browser conversion. Limit is ${wasmMaxMb} MB.`)
  }

  try {
    return await convertWithFfmpegWasm(kind, file, sourceFormat, targetFormat)
  } catch (error: any) {
    throw new Error(error?.message || 'Browser conversion failed.')
  }
}

export const convertAudioFile = (
  file: File,
  sourceFormat: string,
  targetFormat: string,
  options?: any
) => convertByStrategy('audio', file, sourceFormat, targetFormat, options)

export const convertImageFile = (
  file: File,
  sourceFormat: string,
  targetFormat: string,
  options?: any
) => convertByStrategy('image', file, sourceFormat, targetFormat, options)

export const convertVideoFile = (
  file: File,
  sourceFormat: string,
  targetFormat: string,
  options?: any
) => convertByStrategy('video', file, sourceFormat, targetFormat, options)
