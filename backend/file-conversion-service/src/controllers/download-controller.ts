import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { createReadStream, existsSync } from 'fs'
import path from 'path'
import { logger } from '../utils/logger'
import { config } from '../config'

interface DownloadParams {
  Params: {
    id: string
  }
}

export class DownloadController {
  constructor(private server: FastifyInstance) {}

  async download(
    request: FastifyRequest<DownloadParams>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params

      // Get job status to find output file
      const job = await (this.server as any).queue.getJob(id)
      if (!job) {
        return reply.code(404).send({ error: 'Job not found' })
      }

      const state = await job.getState()
      if (state !== 'completed') {
        return reply.code(400).send({
          error: 'Job not completed',
          status: state,
        })
      }

      const result = job.returnvalue
      if (!result || !result.outputPath) {
        return reply.code(404).send({ error: 'Output file not found' })
      }

      const outputPath = result.outputPath
      if (!existsSync(outputPath)) {
        return reply.code(404).send({ error: 'File no longer available' })
      }

      // Set appropriate headers
      const filename = result.outputFilename || path.basename(outputPath)
      reply.header('Content-Disposition', `attachment; filename="${filename}"`)
      reply.header('Content-Type', result.mimeType || 'application/octet-stream')

      // Stream file to response
      const stream = createReadStream(outputPath)
      return reply.send(stream)
    } catch (error) {
      logger.error(error, 'Download failed')
      return reply.code(500).send({
        error: 'Download failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }
}
