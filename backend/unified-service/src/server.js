require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { logger } = require('./logger');
const { register: metricsRegister, httpRequestDuration } = require('./metrics');
const { globalLimiter } = require('./rateLimit');
const routes = require('./routes');
const { uploadAny, uploadFileOnly, uploadAudioOnly } = require('./upload');
const { InMemoryQueue } = require('./in-memory-queue');
const { processFileConversion } = require('./processors/file');
const { processMediaConversion } = require('./processors/media');
const { processFilter } = require('./processors/filter');
const { processAudioFilter } = require('./processors/audio');
const { TEMP_DIR, PORT, CORS_ORIGIN, MAX_FILE_SIZE, MAX_MEDIA_SIZE, MAX_AUDIO_SIZE, NODE_ENV } = require('./config');

const app = express();
const jobs = new Map();

// Middleware
app.set('trust proxy', 1);
const corsOrigin = Array.isArray(CORS_ORIGIN) && CORS_ORIGIN.length === 1 ? CORS_ORIGIN[0] : CORS_ORIGIN;
app.use(cors({ origin: corsOrigin, credentials: false }));
logger.info({ corsOrigin }, 'CORS configuration');
app.use(express.json({ limit: '12mb' }));
app.use(express.urlencoded({ extended: true, limit: '12mb' }));
app.use(globalLimiter);

// Request logging/metrics
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    httpRequestDuration.labels(req.method, req.route?.path || req.path, res.statusCode).observe(duration);
    logger.info({ method: req.method, url: req.url, status: res.statusCode, duration: `${duration}s` }, 'HTTP Request');
  });
  next();
});

const fileQueue = new InMemoryQueue('file-conversion', processFileConversion);
const mediaQueue = new InMemoryQueue('media-conversion', processMediaConversion);
const filterQueue = new InMemoryQueue('filter-processing', processFilter);
const audioFilterQueue = new InMemoryQueue('audio-filter', processAudioFilter);

// Attach routes
app.use(routes({
  metrics: { register: metricsRegister },
  uploadAny,
  uploadFileOnly,
  uploadAudioOnly,
  fileQueue,
  mediaQueue,
  filterQueue,
  audioFilterQueue,
  jobs,
  logger,
}));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint not found', path: req.path });
});

// Global error handler
app.use((err, req, res, next) => {
  logger.error({ error: err, path: req.path }, 'Unhandled error');
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: NODE_ENV === 'development' ? err.message : undefined
  });
});

// Cleanup old jobs every 5 minutes
setInterval(async () => {
  const now = Date.now();
  const oneHour = 60 * 60 * 1000;
  for (const [jobId, job] of jobs.entries()) {
    const jobAge = now - new Date(job.createdAt || now).getTime();
    if (jobAge > oneHour) jobs.delete(jobId);
  }
}, 5 * 60 * 1000);

// Startup
app.listen(PORT, '0.0.0.0', () => {
  logger.info({
    port: PORT,
    corsOrigin: CORS_ORIGIN,
    uploadDir: TEMP_DIR,
    maxFileSize: `${MAX_FILE_SIZE / (1024 * 1024)}MB`,
    maxMediaSize: `${MAX_MEDIA_SIZE / (1024 * 1024)}MB`,
    maxAudioSize: `${MAX_AUDIO_SIZE / (1024 * 1024)}MB`,
    nodeEnv: NODE_ENV
  }, 'Unified Conversion Service started');
});

async function gracefulShutdown(signal) {
  logger.info({ signal }, 'Shutting down gracefully...');
  try {
    await fileQueue.close();
    await mediaQueue.close();
    await filterQueue.close();
    await audioFilterQueue.close();
    logger.info('Shutdown complete');
    process.exit(0);
  } catch (error) {
    logger.error({ error }, 'Error during shutdown');
    process.exit(1);
  }
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('unhandledRejection', (reason, promise) => {
  logger.error({ reason, promise }, 'Unhandled Promise Rejection');
  process.exit(1);
});
process.on('uncaughtException', (error) => {
  logger.error({ error }, 'Uncaught Exception');
  process.exit(1);
});
