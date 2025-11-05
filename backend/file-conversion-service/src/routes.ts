import { FastifyInstance } from 'fastify'
import { ConversionController } from './controllers/conversion-controller'
import { DownloadController } from './controllers/download-controller'
import { StatusController } from './controllers/status-controller'

export function setupRoutes(server: FastifyInstance) {
  const conversionController = new ConversionController(server)
  const downloadController = new DownloadController(server)
  const statusController = new StatusController(server)

  // Conversion endpoints
  server.post('/api/convert', conversionController.convert.bind(conversionController))

  // Download endpoints
  server.get('/api/download/:id', downloadController.download.bind(downloadController))

  // Status endpoints
  server.get('/api/status/:jobId', statusController.getStatus.bind(statusController))
  server.get('/api/jobs/:jobId', statusController.getJob.bind(statusController))

  // Root endpoint
  server.get('/', async () => {
    return {
      service: 'file-conversion-service',
      version: '1.0.0',
      status: 'running',
      endpoints: {
        convert: 'POST /api/convert',
        download: 'GET /api/download/:id',
        status: 'GET /api/status/:jobId',
        health: 'GET /health',
        metrics: 'GET /metrics',
      },
    }
  })
}
