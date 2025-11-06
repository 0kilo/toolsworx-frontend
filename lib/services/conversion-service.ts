import { apiClient, ConversionJob } from './api-client'

export interface ConversionOptions {
  quality?: number
  width?: number
  height?: number
  compression?: number
  [key: string]: any
}

export class ConversionService {
  // File conversions
  static async convertPdfToWord(file: File): Promise<ConversionJob> {
    return apiClient.convertFile(file, 'docx')
  }

  static async convertWordToPdf(file: File): Promise<ConversionJob> {
    return apiClient.convertFile(file, 'pdf')
  }

  static async convertExcelToCsv(file: File): Promise<ConversionJob> {
    return apiClient.convertFile(file, 'csv')
  }

  static async convertCsvToExcel(file: File): Promise<ConversionJob> {
    return apiClient.convertFile(file, 'xlsx')
  }

  static async convertJsonToYaml(file: File): Promise<ConversionJob> {
    return apiClient.convertFile(file, 'yaml')
  }

  static async convertYamlToJson(file: File): Promise<ConversionJob> {
    return apiClient.convertFile(file, 'json')
  }

  // Media conversions
  static async convertImageFormat(file: File, targetFormat: string, options?: ConversionOptions): Promise<ConversionJob> {
    return apiClient.convertMedia(file, targetFormat, options)
  }

  static async resizeImage(file: File, width: number, height: number): Promise<ConversionJob> {
    return apiClient.convertMedia(file, 'resize', { width, height })
  }

  static async compressImage(file: File, quality: number = 80): Promise<ConversionJob> {
    return apiClient.convertMedia(file, 'compress', { quality })
  }

  static async convertVideoFormat(file: File, targetFormat: string, options?: ConversionOptions): Promise<ConversionJob> {
    return apiClient.convertMedia(file, targetFormat, options)
  }

  static async convertAudioFormat(file: File, targetFormat: string, options?: ConversionOptions): Promise<ConversionJob> {
    return apiClient.convertMedia(file, targetFormat, options)
  }

  static async extractAudioFromVideo(file: File, audioFormat: string = 'mp3'): Promise<ConversionJob> {
    return apiClient.convertMedia(file, 'extract-audio', { format: audioFormat })
  }

  // Filters
  static async applyImageFilter(file: File, filterType: string, intensity?: number): Promise<ConversionJob> {
    return apiClient.applyFilter(file, filterType, { intensity })
  }

  static async adjustImageBrightness(file: File, brightness: number): Promise<ConversionJob> {
    return apiClient.applyFilter(file, 'brightness', { value: brightness })
  }

  static async adjustImageContrast(file: File, contrast: number): Promise<ConversionJob> {
    return apiClient.applyFilter(file, 'contrast', { value: contrast })
  }

  static async applyGrayscaleFilter(file: File): Promise<ConversionJob> {
    return apiClient.applyFilter(file, 'grayscale')
  }

  static async applySepiaFilter(file: File): Promise<ConversionJob> {
    return apiClient.applyFilter(file, 'sepia')
  }

  // Utility methods
  static async pollJobStatus(jobId: string, onProgress?: (job: ConversionJob) => void): Promise<ConversionJob> {
    return new Promise((resolve, reject) => {
      const poll = async () => {
        try {
          const job = await apiClient.getJobStatus(jobId)
          
          if (onProgress) {
            onProgress(job)
          }

          if (job.status === 'completed') {
            resolve(job)
          } else if (job.status === 'failed') {
            reject(new Error(job.error || 'Conversion failed'))
          } else {
            // Continue polling
            setTimeout(poll, 2000)
          }
        } catch (error) {
          reject(error)
        }
      }

      poll()
    })
  }

  static async downloadConvertedFile(jobId: string, filename?: string): Promise<void> {
    try {
      const blob = await apiClient.downloadFile(jobId)
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename || `converted-file-${jobId}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download failed:', error)
      throw error
    }
  }
}