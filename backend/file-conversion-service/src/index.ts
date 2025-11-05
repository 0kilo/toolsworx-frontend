import Fastify from 'fastify'
import cors from '@fastify/cors'
import multipart from '@fastify/multipart'
import { config } from './config'
import { setupRoutes } from './routes'
import { ConversionQueue } from './queue/conversion-queue'
import { RateLimiter } from './middleware/rate-limiter'
import { logger } from './utils/logger'
import { HealthChecker } from './health/health-checker'
import { MetricsCollector } from './metrics/metrics-collector'

async function start() {
  const server = Fastify({
    logger: logger as any,
    bodyLimit: config.maxFileSize,
    requestTimeout: 300000, // 5 minutes
  })

  // Register plugins
  await server.register(cors, {
    origin: config.corsOrigin,
    credentials: true,
  })

  await server.register(multipart, {
    limits: {
      fileSize: config.maxFileSize,
      files: 10,
    },
  })

  // Initialize services
  const conversionQueue = new ConversionQueue()
  const rateLimiter = new RateLimiter()
  const healthChecker = new HealthChecker()
  const metricsCollector = new MetricsCollector()

  // Decorate server with services
  server.decorate('queue', conversionQueue)
  server.decorate('rateLimiter', rateLimiter)
  server.decorate('healthChecker', healthChecker)
  server.decorate('metrics', metricsCollector)

  // Setup routes
  setupRoutes(server)

  // Health check endpoint
  server.get('/health', async (request, reply) => {
    const health = await healthChecker.checkHealth()
    const statusCode = health.status === 'healthy' ? 200 : 503
    return reply.code(statusCode).send(health)
  })

  // Ready check endpoint (for load balancers)
  server.get('/ready', async (request, reply) => {
    return reply.send({ ready: true, timestamp: new Date().toISOString() })
  })

  // Metrics endpoint (Prometheus format)
  server.get('/metrics', async (request, reply) => {
    const metrics = await metricsCollector.getMetrics()
    return reply.type('text/plain').send(metrics)
  })

  // Start server
  try {
    await server.listen({
      port: config.port,
      host: '0.0.0.0',
    })
    logger.info(`File conversion service started on port ${config.port}`)
  } catch (err) {
    logger.error(err)
    process.exit(1)
  }

  // Graceful shutdown
  const signals: NodeJS.Signals[] = ['SIGTERM', 'SIGINT']
  signals.forEach((signal) => {
    process.on(signal, async () => {
      logger.info(`Received ${signal}, shutting down gracefully...`)
      await conversionQueue.close()
      await server.close()
      process.exit(0)
    })
  })
}

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  logger.error(err)
  process.exit(1)
})

start()
