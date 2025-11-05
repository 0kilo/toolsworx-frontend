import { Queue, Worker, Job } from 'bullmq'
import Redis from 'ioredis'
import { config } from '../config'
import { logger } from '../utils/logger'
import { FileConversionProcessor } from '../processors/file-conversion-processor'

export interface ConversionJobData {
  jobId: string
  inputPath: string
  inputFilename: string
  targetFormat: string
  options: Record<string, any>
  userId: string
}

export class ConversionQueue {
  private queue: Queue
  private worker: Worker
  private redis: Redis
  private processor: FileConversionProcessor

  constructor() {
    this.redis = new Redis(config.redisUrl, {
      maxRetriesPerRequest: null,
    })

    this.queue = new Queue('file-conversion', {
      connection: this.redis,
      defaultJobOptions: {
        removeOnComplete: config.queue.removeOnComplete,
        removeOnFail: config.queue.removeOnFail,
        attempts: config.queue.maxAttempts,
        backoff: {
          type: 'exponential',
          delay: config.queue.backoffDelay,
        },
      },
    })

    this.processor = new FileConversionProcessor()

    this.worker = new Worker(
      'file-conversion',
      async (job: Job<ConversionJobData>) => {
        return this.processJob(job)
      },
      {
        connection: this.redis,
        concurrency: 5,
        limiter: {
          max: 10,
          duration: 60000, // 10 jobs per minute
        },
      }
    )

    this.setupWorkerEvents()
  }

  private setupWorkerEvents() {
    this.worker.on('completed', (job) => {
      logger.info({ jobId: job.id }, 'Job completed successfully')
    })

    this.worker.on('failed', (job, err) => {
      logger.error({ jobId: job?.id, error: err.message }, 'Job failed')
    })

    this.worker.on('progress', (job, progress) => {
      logger.debug({ jobId: job.id, progress }, 'Job progress updated')
    })
  }

  private async processJob(job: Job<ConversionJobData>) {
    const { inputPath, targetFormat, options, jobId } = job.data

    logger.info({
      jobId: job.id,
      inputPath,
      targetFormat,
    }, 'Processing conversion job')

    try {
      // Update progress
      await job.updateProgress(10)

      // Process the conversion
      const result = await this.processor.process({
        inputPath,
        targetFormat,
        options,
        onProgress: async (progress: number) => {
          await job.updateProgress(progress)
        },
      })

      await job.updateProgress(100)

      return {
        success: true,
        outputPath: result.outputPath,
        outputFilename: result.filename,
        mimeType: result.mimeType,
        size: result.size,
      }
    } catch (error) {
      logger.error(error, 'Conversion failed')
      throw error
    }
  }

  async addConversionJob(data: ConversionJobData) {
    const job = await this.queue.add('convert', data, {
      jobId: data.jobId,
    })

    logger.info({ jobId: job.id }, 'Conversion job queued')
    return job
  }

  async getJob(jobId: string) {
    return this.queue.getJob(jobId)
  }

  async close() {
    await this.worker.close()
    await this.queue.close()
    await this.redis.quit()
  }
}
