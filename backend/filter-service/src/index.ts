import Fastify from 'fastify'
import cors from '@fastify/cors'
import multipart from '@fastify/multipart'
import sharp from 'sharp'
import { promises as fs } from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import { createWriteStream } from 'fs'
import { pipeline } from 'stream/promises'
import { Queue, Worker } from 'bullmq'
import Redis from 'ioredis'

const PORT = parseInt(process.env.PORT || '3002', 10)
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379'
const TEMP_DIR = process.env.TEMP_DIR || '/tmp/filter-processing'

const server = Fastify({ logger: true, bodyLimit: 209715200 })

// Initialize Redis and Queue
const redis = new Redis(REDIS_URL, { maxRetriesPerRequest: null })
const filterQueue = new Queue('filter-processing', { connection: redis })

// Worker for applying filters
const worker = new Worker(
  'filter-processing',
  async (job) => {
    const { inputPath, outputPath, filters } = job.data
    let pipeline = sharp(inputPath)

    // Apply filters in sequence
    for (const filter of filters) {
      await job.updateProgress((filters.indexOf(filter) / filters.length) * 100)

      switch (filter.type) {
        case 'grayscale':
          pipeline = pipeline.grayscale()
          break
        case 'blur':
          pipeline = pipeline.blur(filter.value || 1)
          break
        case 'sharpen':
          pipeline = pipeline.sharpen(filter.value || 1)
          break
        case 'brightness':
          pipeline = pipeline.modulate({ brightness: 1 + (filter.value || 0) / 100 })
          break
        case 'contrast':
          pipeline = pipeline.linear(1 + (filter.value || 0) / 100, 0)
          break
        case 'saturation':
          pipeline = pipeline.modulate({ saturation: 1 + (filter.value || 0) / 100 })
          break
        case 'hue':
          pipeline = pipeline.modulate({ hue: filter.value })
          break
        case 'sepia':
          pipeline = pipeline.recomb([
            [0.393, 0.769, 0.189],
            [0.349, 0.686, 0.168],
            [0.272, 0.534, 0.131],
          ])
          break
        case 'vintage':
          pipeline = pipeline
            .modulate({ saturation: 0.8, brightness: 1.1 })
            .tint({ r: 255, g: 240, b: 200 })
          break
      }
    }

    await pipeline.toFile(outputPath)
    return { outputPath, success: true }
  },
  { connection: redis, concurrency: 10 }
)

// Register plugins
await server.register(cors)
await server.register(multipart, { limits: { fileSize: 209715200 } })

// Routes
server.post('/api/filter', async (request, reply) => {
  try {
    const data = await request.file()
    if (!data) return reply.code(400).send({ error: 'No file uploaded' })

    const jobId = uuidv4()
    const tempDir = path.join(TEMP_DIR, jobId)
    await fs.mkdir(tempDir, { recursive: true })

    const inputPath = path.join(tempDir, data.filename)
    await pipeline(data.file, createWriteStream(inputPath))

    // Get filter parameters
    const fields = data.fields as any
    const filters = fields.filters ? JSON.parse(fields.filters.value) : []
    const outputFormat = fields.outputFormat?.value || 'jpeg'

    const outputPath = path.join(tempDir, `output.${outputFormat}`)

    const job = await filterQueue.add('apply-filters', {
      jobId,
      inputPath,
      outputPath,
      filters,
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
  const job = await filterQueue.getJob(jobId)

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
  const job = await filterQueue.getJob(id)

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
  services: [{ service: 'sharp', status: 'healthy' }],
}))

server.get('/', async () => ({
  service: 'filter-service',
  version: '1.0.0',
  status: 'running',
}))

// Start server
await server.listen({ port: PORT, host: '0.0.0.0' })
console.log(`Filter service started on port ${PORT}`)

process.on('SIGTERM', async () => {
  await worker.close()
  await filterQueue.close()
  await server.close()
  process.exit(0)
})
