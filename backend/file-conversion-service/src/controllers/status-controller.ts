import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { logger } from '../utils/logger'

interface StatusParams {
  Params: {
    jobId: string
  }
}

export class StatusController {
  constructor(private server: FastifyInstance) {}

  async getStatus(
    request: FastifyRequest<StatusParams>,
    reply: FastifyReply
  ) {
    try {
      const { jobId } = request.params

      const job = await (this.server as any).queue.getJob(jobId)
      if (!job) {
        return reply.code(404).send({ error: 'Job not found' })
      }

      const state = await job.getState()
      const progress = job.progress || 0

      return reply.send({
        jobId: job.id,
        status: state,
        progress,
        createdAt: new Date(job.timestamp),
        processedAt: job.processedOn ? new Date(job.processedOn) : null,
        finishedAt: job.finishedOn ? new Date(job.finishedOn) : null,
        result: job.returnvalue || null,
        error: job.failedReason || null,
      })
    } catch (error) {
      logger.error(error, 'Status check failed')
      return reply.code(500).send({
        error: 'Status check failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  async getJob(
    request: FastifyRequest<StatusParams>,
    reply: FastifyReply
  ) {
    return this.getStatus(request, reply)
  }
}
