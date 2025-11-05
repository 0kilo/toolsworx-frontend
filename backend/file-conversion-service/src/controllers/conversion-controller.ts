import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { pipeline } from 'stream/promises'
import { createWriteStream } from 'fs'
import { mkdir } from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import { logger } from '../utils/logger'
import { config } from '../config'

interface ConvertRequest {
  Body: {
    targetFormat: string
    options?: Record<string, any>
  }
}

export class ConversionController {
  constructor(private server: FastifyInstance) {}

  async convert(request: FastifyRequest, reply: FastifyReply) {
    try {
      // Get uploaded file
      const data = await request.file()
      if (!data) {
        return reply.code(400).send({ error: 'No file uploaded' })
      }

      // Check rate limits
      const rateLimitCheck = await (this.server as any).rateLimiter.checkLimit(
        request.ip,
        'anonymous'
      )
      if (!rateLimitCheck.allowed) {
        return reply.code(429).send({
          error: 'Rate limit exceeded',
          remaining: rateLimitCheck.remaining,
          resetTime: rateLimitCheck.resetTime,
        })
      }

      // Validate file size
      const fileSize = parseInt(request.headers['content-length'] || '0', 10)
      if (fileSize > config.maxFileSize) {
        return reply.code(413).send({
          error: 'File too large',
          maxSize: config.maxFileSize,
          receivedSize: fileSize,
        })
      }

      // Get target format and options from fields
      let targetFormat = 'pdf'
      let options = {}

      const fields = data.fields as any
      if (fields.targetFormat) {
        targetFormat = (fields.targetFormat as any).value
      }
      if (fields.options) {
        try {
          options = JSON.parse((fields.options as any).value)
        } catch (e) {
          logger.warn('Failed to parse options', e)
        }
      }

      // Save uploaded file to temp directory
      const jobId = uuidv4()
      const tempDir = path.join(config.tempDir, jobId)
      await mkdir(tempDir, { recursive: true })

      const inputFilename = data.filename
      const inputPath = path.join(tempDir, inputFilename)

      await pipeline(data.file, createWriteStream(inputPath))

      logger.info({
        jobId,
        filename: inputFilename,
        size: fileSize,
        targetFormat,
      }, 'File uploaded, queuing conversion')

      // Queue conversion job
      const job = await (this.server as any).queue.addConversionJob({
        jobId,
        inputPath,
        inputFilename,
        targetFormat,
        options,
        userId: 'anonymous',
      })

      // Record metrics
      ;(this.server as any).metrics.recordJobStart(
        'file-conversion',
        'anonymous',
        fileSize
      )

      return reply.code(202).send({
        jobId: job.id,
        status: 'queued',
        estimatedTime: '2-5 minutes',
        statusUrl: `/api/status/${job.id}`,
        downloadUrl: `/api/download/${jobId}`,
      })
    } catch (error) {
      logger.error(error, 'Conversion request failed')
      return reply.code(500).send({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }
}
