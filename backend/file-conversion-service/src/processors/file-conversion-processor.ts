import { spawn } from 'child_process'
import { promises as fs } from 'fs'
import path from 'path'
import os from 'os'
import xlsx from 'xlsx'
import archiver from 'archiver'
import unzipper from 'unzipper'
import { logger } from '../utils/logger'
import { config } from '../config'

export interface ConversionRequest {
  inputPath: string
  targetFormat: string
  options: Record<string, any>
  onProgress?: (progress: number) => Promise<void>
}

export interface ConversionResult {
  outputPath: string
  filename: string
  mimeType: string
  size: number
}

export class FileConversionProcessor {
  async process(request: ConversionRequest): Promise<ConversionResult> {
    const { inputPath, targetFormat } = request

    // Determine conversion type based on file extension and target
    const inputExt = path.extname(inputPath).toLowerCase().slice(1)

    // Document conversions (PDF, Word, etc.)
    if (this.isDocumentConversion(inputExt, targetFormat)) {
      return this.convertDocument(request)
    }

    // Spreadsheet conversions
    if (this.isSpreadsheetConversion(inputExt, targetFormat)) {
      return this.convertSpreadsheet(request)
    }

    // Archive operations
    if (this.isArchiveOperation(inputExt, targetFormat)) {
      return this.processArchive(request)
    }

    throw new Error(`Unsupported conversion: ${inputExt} to ${targetFormat}`)
  }

  private isDocumentConversion(from: string, to: string): boolean {
    const docFormats = ['pdf', 'doc', 'docx', 'odt', 'rtf', 'txt', 'html']
    return docFormats.includes(from) && docFormats.includes(to)
  }

  private isSpreadsheetConversion(from: string, to: string): boolean {
    const sheetFormats = ['xlsx', 'xls', 'csv', 'ods']
    return sheetFormats.includes(from) && sheetFormats.includes(to)
  }

  private isArchiveOperation(from: string, to: string): boolean {
    const archiveFormats = ['zip', 'tar', 'gz', '7z']
    return archiveFormats.includes(from) || archiveFormats.includes(to)
  }

  private async convertDocument(request: ConversionRequest): Promise<ConversionResult> {
    const { inputPath, targetFormat, onProgress } = request
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'doc-convert-'))
    const outputDir = path.join(tempDir, 'output')
    await fs.mkdir(outputDir, { recursive: true })

    try {
      if (onProgress) await onProgress(20)

      // Use LibreOffice for document conversion
      await this.executeLibreOffice(inputPath, outputDir, targetFormat)

      if (onProgress) await onProgress(80)

      // Find output file
      const files = await fs.readdir(outputDir)
      if (files.length === 0) {
        throw new Error('No output file generated')
      }

      const outputPath = path.join(outputDir, files[0])
      const stats = await fs.stat(outputPath)

      return {
        outputPath,
        filename: `converted.${targetFormat}`,
        mimeType: this.getMimeType(targetFormat),
        size: stats.size,
      }
    } catch (error) {
      // Cleanup on error
      await fs.rm(tempDir, { recursive: true, force: true }).catch(() => {})
      throw error
    }
  }

  private async executeLibreOffice(
    inputPath: string,
    outputDir: string,
    targetFormat: string
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const inputExt = path.extname(inputPath).toLowerCase().slice(1)
      const args = [
        '--headless',
        '--convert-to',
        targetFormat,
        '--outdir',
        outputDir,
      ]
      
      // Add PDF import filter for PDF files
      if (inputExt === 'pdf') {
        args.push('--infilter=writer_pdf_import')
      }
      
      args.push(inputPath)

      const process = spawn(config.libreOfficePath, args, {
        timeout: 300000, // 5 minutes
        stdio: 'pipe',
      })

      let stderr = ''

      process.stderr?.on('data', (data) => {
        stderr += data.toString()
      })

      process.on('close', (code) => {
        if (code === 0) {
          resolve()
        } else {
          reject(new Error(`LibreOffice exited with code ${code}: ${stderr}`))
        }
      })

      process.on('error', (error) => {
        reject(new Error(`Failed to start LibreOffice: ${error.message}`))
      })
    })
  }

  private async convertSpreadsheet(request: ConversionRequest): Promise<ConversionResult> {
    const { inputPath, targetFormat, onProgress } = request
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'sheet-convert-'))

    try {
      if (onProgress) await onProgress(30)

      // Read workbook
      const workbook = xlsx.readFile(inputPath)
      const sheetName = workbook.SheetNames[0]
      const sheet = workbook.Sheets[sheetName]

      if (onProgress) await onProgress(60)

      let outputPath: string
      let outputData: string | Buffer

      if (targetFormat === 'csv') {
        // Convert to CSV
        outputData = xlsx.utils.sheet_to_csv(sheet)
        outputPath = path.join(tempDir, 'output.csv')
        await fs.writeFile(outputPath, outputData, 'utf-8')
      } else if (targetFormat === 'xlsx' || targetFormat === 'xls') {
        // Convert to Excel
        const newWorkbook = xlsx.utils.book_new()
        xlsx.utils.book_append_sheet(newWorkbook, sheet, sheetName)
        outputPath = path.join(tempDir, `output.${targetFormat}`)
        xlsx.writeFile(newWorkbook, outputPath)
      } else {
        throw new Error(`Unsupported spreadsheet format: ${targetFormat}`)
      }

      if (onProgress) await onProgress(90)

      const stats = await fs.stat(outputPath)

      return {
        outputPath,
        filename: `converted.${targetFormat}`,
        mimeType: this.getMimeType(targetFormat),
        size: stats.size,
      }
    } catch (error) {
      await fs.rm(tempDir, { recursive: true, force: true }).catch(() => {})
      throw error
    }
  }

  private async processArchive(request: ConversionRequest): Promise<ConversionResult> {
    const { inputPath, targetFormat, onProgress } = request
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'archive-'))
    const outputPath = path.join(tempDir, `archive.${targetFormat}`)

    try {
      if (targetFormat === 'zip') {
        // Create ZIP archive
        const output = require('fs').createWriteStream(outputPath)
        const archive = archiver('zip', { zlib: { level: 9 } })

        return new Promise((resolve, reject) => {
          output.on('close', async () => {
            const stats = await fs.stat(outputPath)
            resolve({
              outputPath,
              filename: 'archive.zip',
              mimeType: 'application/zip',
              size: stats.size,
            })
          })

          archive.on('error', reject)

          archive.pipe(output)
          archive.file(inputPath, { name: path.basename(inputPath) })
          archive.finalize()
        })
      }

      throw new Error(`Archive format not yet implemented: ${targetFormat}`)
    } catch (error) {
      await fs.rm(tempDir, { recursive: true, force: true }).catch(() => {})
      throw error
    }
  }

  private getMimeType(format: string): string {
    const mimeTypes: Record<string, string> = {
      pdf: 'application/pdf',
      doc: 'application/msword',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      xls: 'application/vnd.ms-excel',
      csv: 'text/csv',
      txt: 'text/plain',
      html: 'text/html',
      zip: 'application/zip',
      json: 'application/json',
      xml: 'application/xml',
    }

    return mimeTypes[format] || 'application/octet-stream'
  }
}
