import Fastify from 'fastify'
import cors from '@fastify/cors'
import multipart from '@fastify/multipart'
import { promises as fs } from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import { createWriteStream } from 'fs'
import { pipeline } from 'stream/promises'
import ffmpeg from 'fluent-ffmpeg'
import { Queue, Worker } from 'bullmq'
import Redis from 'ioredis'

const PORT = parseInt(process.env.PORT || '3001', 10)
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379'
const TEMP_DIR = process.env.TEMP_DIR || '/tmp/media-processing'

const server = Fastify({ logger: true, bodyLimit: 2147483648 })

// Initialize Redis and Queue
const redis = new Redis(REDIS_URL, { maxRetriesPerRequest: null })
const mediaQueue = new Queue('media-conversion', { connection: redis })

// Worker for processing media
const worker = new Worker(
  'media-conversion',
  async (job) => {
    const { inputPath, outputPath, format, options } = job.data

    return new Promise((resolve, reject) => {
      let command = ffmpeg(inputPath)
        .output(outputPath)
        .on('end', () => resolve({ outputPath, success: true }))
        .on('error', reject)
        .on('progress', (progress) => job.updateProgress(progress.percent || 0))

      // Apply video settings
      if (options.videoCodec) command = command.videoCodec(options.videoCodec)
      if (options.audioCodec) command = command.audioCodec(options.audioCodec)
      if (options.bitrate) command = command.videoBitrate(options.bitrate)
      if (options.resolution) command = command.size(options.resolution)
      if (options.framerate) command = command.fps(options.framerate)

      command.run()
    })
  },
  { connection: redis, concurrency: 2 }
)

// Register plugins
await server.register(cors)
await server.register(multipart, { limits: { fileSize: 2147483648 } })

// Routes
server.post('/api/convert', async (request, reply) => {
  try {
    const data = await request.file()
    if (!data) return reply.code(400).send({ error: 'No file uploaded' })

    const jobId = uuidv4()
    const tempDir = path.join(TEMP_DIR, jobId)
    await fs.mkdir(tempDir, { recursive: true })

    const inputPath = path.join(tempDir, data.filename)
    await pipeline(data.file, createWriteStream(inputPath))

    // Get conversion parameters
    const fields = data.fields as any
    const format = fields.outputFormat?.value || 'mp4'
    const options = fields.options ? JSON.parse(fields.options.value) : {}

    const outputExt = format
    const outputPath = path.join(tempDir, `output.${outputExt}`)

    const job = await mediaQueue.add('convert', {
      jobId,
      inputPath,
      outputPath,
      format,
      options,
    })

    return reply.code(202).send({
      jobId: job.id,
      status: 'queued',
      statusUrl: `/api/status/${job.id}`,
      downloadUrl: `/api/download/${jobId}`,
    })
  } catch (error: any) {
    return reply.code(500).send({ error: error.message })
  }
})

server.get('/api/status/:jobId', async (request, reply) => {
  const { jobId } = request.params as { jobId: string }
  const job = await mediaQueue.getJob(jobId)

  if (!job) return reply.code(404).send({ error: 'Job not found' })

  const state = await job.getState()
  const progress = job.progress || 0

  return {
    jobId: job.id,
    status: state,
    progress,
    result: job.returnvalue,
    error: job.failedReason,
  }
})

server.get('/api/download/:id', async (request, reply) => {
  const { id } = request.params as { id: string }
  const job = await mediaQueue.getJob(id)

  if (!job || (await job.getState()) !== 'completed') {
    return reply.code(404).send({ error: 'File not found or not ready' })
  }

  const result = job.returnvalue
  const stream = require('fs').createReadStream(result.outputPath)
  return reply.send(stream)
})

server.get('/health', async () => ({
  status: 'healthy',
  timestamp: new Date().toISOString(),
  services: [{ service: 'ffmpeg', status: 'healthy' }],
}))

server.get('/', async () => ({
  service: 'media-conversion-service',
  version: '1.0.0',
  status: 'running',
}))

// Start server
await server.listen({ port: PORT, host: '0.0.0.0' })
console.log(`Media conversion service started on port ${PORT}`)

process.on('SIGTERM', async () => {
  await worker.close()
  await mediaQueue.close()
  await server.close()
  process.exit(0)
})
