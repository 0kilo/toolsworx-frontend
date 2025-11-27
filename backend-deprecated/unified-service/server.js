require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { createWriteStream, createReadStream } = require('fs');
const { spawn } = require('child_process');
const { v4: uuidv4 } = require('uuid');
const Redis = require('ioredis');
const { Queue, Worker } = require('bullmq');
const sharp = require('sharp');
const ffmpeg = require('fluent-ffmpeg');
const xlsx = require('xlsx');
const archiver = require('archiver');
const pino = require('pino');
const promClient = require('prom-client');
const rateLimit = require('express-rate-limit');

// Initialize logger
const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: process.env.NODE_ENV === 'development' ? {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'HH:MM:ss Z',
      ignore: 'pid,hostname'
    }
  } : undefined
});

// Initialize Prometheus metrics
const register = new promClient.Registry();
promClient.collectDefaultMetrics({ register });

const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register]
});

const conversionCounter = new promClient.Counter({
  name: 'conversions_total',
  help: 'Total number of conversions processed',
  labelNames: ['type', 'status'],
  registers: [register]
});

const activeJobsGauge = new promClient.Gauge({
  name: 'active_jobs',
  help: 'Number of currently active jobs',
  labelNames: ['type'],
  registers: [register]
});

const app = express();
const PORT = process.env.PORT || 3010;
const REDIS_URL = process.env.REDIS_URL || 'redis://redis:6379';
const TEMP_DIR = process.env.TEMP_DIR || '/tmp/uploads';
const LIBRE_OFFICE_PATH = process.env.LIBRE_OFFICE_PATH || '/usr/bin/libreoffice';

// CORS Configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(limiter);

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    httpRequestDuration.labels(req.method, req.route?.path || req.path, res.statusCode).observe(duration);
    logger.info({
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}s`
    }, 'HTTP Request');
  });
  next();
});

// Configure multer for file uploads
const upload = multer({
  dest: TEMP_DIR,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 500 * 1024 * 1024 // 500MB default
  }
});

// Initialize Redis connection
const redis = new Redis(REDIS_URL, { maxRetriesPerRequest: null });

// Initialize job queues
const fileQueue = new Queue('file-conversion', { connection: redis });
const mediaQueue = new Queue('media-conversion', { connection: redis });
const filterQueue = new Queue('filter-processing', { connection: redis });

// In-memory job storage (for quick lookups)
const jobs = new Map();

// ========================================
// FILE CONVERSION PROCESSOR
// ========================================

async function processFileConversion(job) {
  const { jobId, inputPath, targetFormat, inputExt } = job.data;

  try {
    activeJobsGauge.labels('file').inc();
    const tempDir = path.join(TEMP_DIR, jobId);
    await fs.mkdir(tempDir, { recursive: true });

    await job.updateProgress(10);

    // Determine conversion type
    const docFormats = ['pdf', 'doc', 'docx', 'odt', 'rtf', 'txt', 'html'];
    const sheetFormats = ['xlsx', 'xls', 'csv', 'ods'];

    let outputPath;

    if (docFormats.includes(inputExt) && docFormats.includes(targetFormat)) {
      // Document conversion with LibreOffice
      outputPath = await convertDocument(inputPath, tempDir, targetFormat, job);
    } else if (sheetFormats.includes(inputExt) && sheetFormats.includes(targetFormat)) {
      // Spreadsheet conversion
      outputPath = await convertSpreadsheet(inputPath, tempDir, targetFormat, job);
    } else {
      throw new Error(`Unsupported conversion: ${inputExt} to ${targetFormat}`);
    }

    await job.updateProgress(100);
    conversionCounter.labels('file', 'success').inc();
    activeJobsGauge.labels('file').dec();

    return { outputPath, success: true };
  } catch (error) {
    logger.error({ error, jobId }, 'File conversion error');
    conversionCounter.labels('file', 'failed').inc();
    activeJobsGauge.labels('file').dec();
    throw error;
  }
}

async function convertDocument(inputPath, tempDir, targetFormat, job) {
  const outputDir = path.join(tempDir, 'output');
  await fs.mkdir(outputDir, { recursive: true });

  await job.updateProgress(30);

  // Execute LibreOffice conversion
  await new Promise((resolve, reject) => {
    const args = [
      '--headless',
      '--convert-to',
      targetFormat,
      '--outdir',
      outputDir,
      inputPath
    ];

    const process = spawn(LIBRE_OFFICE_PATH, args, {
      timeout: 300000, // 5 minutes
      stdio: 'pipe',
    });

    let stderr = '';

    process.stderr?.on('data', (data) => {
      stderr += data.toString();
    });

    process.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`LibreOffice exited with code ${code}: ${stderr}`));
      }
    });

    process.on('error', (error) => {
      reject(new Error(`Failed to start LibreOffice: ${error.message}`));
    });
  });

  await job.updateProgress(80);

  // Find output file
  const files = await fs.readdir(outputDir);
  if (files.length === 0) {
    throw new Error('No output file generated');
  }

  return path.join(outputDir, files[0]);
}

async function convertSpreadsheet(inputPath, tempDir, targetFormat, job) {
  await job.updateProgress(30);

  // Read workbook
  const workbook = xlsx.readFile(inputPath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  await job.updateProgress(60);

  let outputPath;

  if (targetFormat === 'csv') {
    // Convert to CSV
    const outputData = xlsx.utils.sheet_to_csv(sheet);
    outputPath = path.join(tempDir, 'output.csv');
    await fs.writeFile(outputPath, outputData, 'utf-8');
  } else if (targetFormat === 'xlsx' || targetFormat === 'xls') {
    // Convert to Excel
    const newWorkbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(newWorkbook, sheet, sheetName);
    outputPath = path.join(tempDir, `output.${targetFormat}`);
    xlsx.writeFile(newWorkbook, outputPath);
  } else {
    throw new Error(`Unsupported spreadsheet format: ${targetFormat}`);
  }

  await job.updateProgress(90);

  return outputPath;
}

// ========================================
// MEDIA CONVERSION PROCESSOR
// ========================================

async function processMediaConversion(job) {
  const { jobId, inputPath, targetFormat, inputExt, options = {} } = job.data;

  try {
    activeJobsGauge.labels('media').inc();
    const tempDir = path.join(TEMP_DIR, jobId);
    await fs.mkdir(tempDir, { recursive: true });

    await job.updateProgress(10);

    const outputPath = path.join(tempDir, `output.${targetFormat}`);

    // Image conversion with Sharp
    const imageFormats = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'tiff'];
    if (imageFormats.includes(inputExt) && imageFormats.includes(targetFormat)) {
      await job.updateProgress(30);
      await sharp(inputPath)
        .toFormat(targetFormat === 'jpg' ? 'jpeg' : targetFormat, {
          quality: options.quality || 90
        })
        .toFile(outputPath);
      await job.updateProgress(100);
      return { outputPath, success: true };
    }

    // Video/Audio conversion with FFmpeg
    await new Promise((resolve, reject) => {
      let command = ffmpeg(inputPath)
        .output(outputPath)
        .on('end', () => resolve())
        .on('error', reject)
        .on('progress', (progress) => {
          job.updateProgress(Math.min(progress.percent || 0, 95));
        });

      // Apply video settings
      if (options.videoCodec) command = command.videoCodec(options.videoCodec);
      if (options.audioCodec) command = command.audioCodec(options.audioCodec);
      if (options.bitrate) command = command.videoBitrate(options.bitrate);
      if (options.resolution) command = command.size(options.resolution);
      if (options.framerate) command = command.fps(options.framerate);

      command.run();
    });

    await job.updateProgress(100);
    conversionCounter.labels('media', 'success').inc();
    activeJobsGauge.labels('media').dec();

    return { outputPath, success: true };
  } catch (error) {
    logger.error({ error, jobId }, 'Media conversion error');
    conversionCounter.labels('media', 'failed').inc();
    activeJobsGauge.labels('media').dec();
    throw error;
  }
}

// ========================================
// FILTER PROCESSOR
// ========================================

async function processFilter(job) {
  const { jobId, inputPath, filters = [], outputFormat = 'jpeg' } = job.data;

  try {
    activeJobsGauge.labels('filter').inc();
    const tempDir = path.join(TEMP_DIR, jobId);
    await fs.mkdir(tempDir, { recursive: true });

    await job.updateProgress(10);

    let pipeline = sharp(inputPath);

    // Apply filters in sequence
    for (const filter of filters) {
      await job.updateProgress(10 + (filters.indexOf(filter) / filters.length) * 80);

      switch (filter.type) {
        case 'grayscale':
          pipeline = pipeline.grayscale();
          break;
        case 'blur':
          pipeline = pipeline.blur(filter.value || 1);
          break;
        case 'sharpen':
          pipeline = pipeline.sharpen(filter.value || 1);
          break;
        case 'brightness':
          pipeline = pipeline.modulate({ brightness: 1 + (filter.value || 0) / 100 });
          break;
        case 'contrast':
          pipeline = pipeline.linear(1 + (filter.value || 0) / 100, 0);
          break;
        case 'saturation':
          pipeline = pipeline.modulate({ saturation: 1 + (filter.value || 0) / 100 });
          break;
        case 'hue':
          pipeline = pipeline.modulate({ hue: filter.value });
          break;
        case 'sepia':
          pipeline = pipeline.recomb([
            [0.393, 0.769, 0.189],
            [0.349, 0.686, 0.168],
            [0.272, 0.534, 0.131],
          ]);
          break;
        case 'vintage':
          pipeline = pipeline
            .modulate({ saturation: 0.8, brightness: 1.1 })
            .tint({ r: 255, g: 240, b: 200 });
          break;
      }
    }

    const outputPath = path.join(tempDir, `output.${outputFormat}`);
    await pipeline.toFile(outputPath);

    await job.updateProgress(100);
    conversionCounter.labels('filter', 'success').inc();
    activeJobsGauge.labels('filter').dec();

    return { outputPath, success: true };
  } catch (error) {
    logger.error({ error, jobId }, 'Filter processing error');
    conversionCounter.labels('filter', 'failed').inc();
    activeJobsGauge.labels('filter').dec();
    throw error;
  }
}

// ========================================
// WORKERS
// ========================================

const fileWorker = new Worker('file-conversion', processFileConversion, {
  connection: redis,
  concurrency: 2,
});

const mediaWorker = new Worker('media-conversion', processMediaConversion, {
  connection: redis,
  concurrency: 2,
});

const filterWorker = new Worker('filter-processing', processFilter, {
  connection: redis,
  concurrency: 10,
});

// ========================================
// HEALTH CHECK ENDPOINTS
// ========================================
app.get('/health', async (req, res) => {
  try {
    // Check Redis connection
    await redis.ping();

    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'unified-conversion-service',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      redis: 'connected',
      services: {
        file_conversion: 'operational',
        media_conversion: 'operational',
        filter_service: 'operational'
      }
    });
  } catch (error) {
    logger.error({ error }, 'Health check failed');
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

// Ready check endpoint (for load balancers)
app.get('/ready', (req, res) => {
  res.json({
    ready: true,
    timestamp: new Date().toISOString()
  });
});

// Metrics endpoint (Prometheus format)
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (error) {
    logger.error({ error }, 'Error generating metrics');
    res.status(500).end(error);
  }
});

// ========================================
// FILE CONVERSION SERVICE ENDPOINTS
// ========================================

// Convert file
app.post('/api/convert', upload.single('file'), async (req, res) => {
  try {
    const { targetFormat, options } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    const jobId = uuidv4();
    const inputExt = path.extname(file.originalname).toLowerCase().slice(1);

    const job = await fileQueue.add('convert', {
      jobId,
      inputPath: file.path,
      targetFormat,
      inputExt,
      options: options ? JSON.parse(options) : {}
    });

    jobs.set(job.id, { type: 'file', status: 'queued', originalFile: file.originalname });

    logger.info({
      jobId: job.id,
      file: file.originalname,
      targetFormat,
      type: 'file'
    }, 'File conversion queued');

    res.status(202).json({
      success: true,
      jobId: job.id,
      status: 'queued',
      message: `File conversion queued: ${file.originalname} to ${targetFormat}`,
      downloadUrl: `/api/download/${job.id}`
    });
  } catch (error) {
    logger.error({ error }, 'File conversion request error');
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get file conversion job status
app.get('/api/status/:jobId', async (req, res) => {
  const { jobId } = req.params;

  try {
    const job = await fileQueue.getJob(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found'
      });
    }

    const state = await job.getState();
    const progress = job.progress || 0;

    res.json({
      success: true,
      jobId: job.id,
      status: state,
      progress,
      downloadUrl: state === 'completed' ? `/api/download/${job.id}` : undefined
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Download converted file
app.get('/api/download/:jobId', async (req, res) => {
  const { jobId } = req.params;

  try {
    const job = await fileQueue.getJob(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found'
      });
    }

    const state = await job.getState();

    if (state !== 'completed') {
      return res.status(400).json({
        success: false,
        error: 'File not ready for download'
      });
    }

    const result = job.returnvalue;
    const stream = createReadStream(result.outputPath);

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="converted.${path.extname(result.outputPath)}"`);
    stream.pipe(res);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ========================================
// MEDIA CONVERSION SERVICE ENDPOINTS
// ========================================

// Convert media
app.post('/api/media/convert', upload.single('file'), async (req, res) => {
  try {
    const { targetFormat, options } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    const jobId = uuidv4();
    const inputExt = path.extname(file.originalname).toLowerCase().slice(1);

    const job = await mediaQueue.add('convert', {
      jobId,
      inputPath: file.path,
      targetFormat,
      inputExt,
      options: options ? JSON.parse(options) : {}
    });

    jobs.set(job.id, { type: 'media', status: 'queued', originalFile: file.originalname });

    logger.info({
      jobId: job.id,
      file: file.originalname,
      targetFormat,
      type: 'media'
    }, 'Media conversion queued');

    res.status(202).json({
      success: true,
      jobId: job.id,
      status: 'queued',
      message: `Media conversion queued: ${file.originalname} to ${targetFormat}`,
      downloadUrl: `/api/media/download/${job.id}`
    });
  } catch (error) {
    logger.error({ error }, 'Media conversion request error');
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get media conversion job status
app.get('/api/media/status/:jobId', async (req, res) => {
  const { jobId } = req.params;

  try {
    const job = await mediaQueue.getJob(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found'
      });
    }

    const state = await job.getState();
    const progress = job.progress || 0;

    res.json({
      success: true,
      jobId: job.id,
      status: state,
      progress,
      downloadUrl: state === 'completed' ? `/api/media/download/${job.id}` : undefined
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Download converted media
app.get('/api/media/download/:jobId', async (req, res) => {
  const { jobId } = req.params;

  try {
    const job = await mediaQueue.getJob(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found'
      });
    }

    const state = await job.getState();

    if (state !== 'completed') {
      return res.status(400).json({
        success: false,
        error: 'Media file not ready for download'
      });
    }

    const result = job.returnvalue;
    const stream = createReadStream(result.outputPath);

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="converted.${path.extname(result.outputPath)}"`);
    stream.pipe(res);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ========================================
// FILTER SERVICE ENDPOINTS
// ========================================

// Apply filter
app.post('/api/filter', upload.single('file'), async (req, res) => {
  try {
    const { filterType, filters, outputFormat } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    const jobId = uuidv4();

    // Parse filters
    let parsedFilters = [];
    if (filters) {
      parsedFilters = JSON.parse(filters);
    } else if (filterType) {
      parsedFilters = [{ type: filterType }];
    }

    const job = await filterQueue.add('apply-filters', {
      jobId,
      inputPath: file.path,
      filters: parsedFilters,
      outputFormat: outputFormat || 'jpeg'
    });

    jobs.set(job.id, { type: 'filter', status: 'queued', originalFile: file.originalname });

    logger.info({
      jobId: job.id,
      file: file.originalname,
      filters: parsedFilters.map(f => f.type).join(', '),
      type: 'filter'
    }, 'Filter queued');

    res.status(202).json({
      success: true,
      jobId: job.id,
      status: 'queued',
      message: `Filter processing queued`,
      downloadUrl: `/api/filter/download/${job.id}`
    });
  } catch (error) {
    logger.error({ error }, 'Filter application error');
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get filter job status
app.get('/api/filter/status/:jobId', async (req, res) => {
  const { jobId } = req.params;

  try {
    const job = await filterQueue.getJob(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found'
      });
    }

    const state = await job.getState();
    const progress = job.progress || 0;

    res.json({
      success: true,
      jobId: job.id,
      status: state,
      progress,
      downloadUrl: state === 'completed' ? `/api/filter/download/${job.id}` : undefined
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Download filtered file
app.get('/api/filter/download/:jobId', async (req, res) => {
  const { jobId } = req.params;

  try {
    const job = await filterQueue.getJob(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found'
      });
    }

    const state = await job.getState();

    if (state !== 'completed') {
      return res.status(400).json({
        success: false,
        error: 'Filtered file not ready for download'
      });
    }

    const result = job.returnvalue;
    const stream = createReadStream(result.outputPath);

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="filtered.${path.extname(result.outputPath)}"`);
    stream.pipe(res);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ========================================
// ERROR HANDLING
// ========================================

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.path
  });
});

// Global error handler
app.use((err, req, res, next) => {
  logger.error({ error: err, path: req.path }, 'Unhandled error');
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ========================================
// STARTUP
// ========================================

// Cleanup old jobs every 5 minutes
setInterval(async () => {
  const now = Date.now();
  const oneHour = 60 * 60 * 1000;

  for (const [jobId, job] of jobs.entries()) {
    const jobAge = now - new Date(job.createdAt || now).getTime();
    if (jobAge > oneHour) {
      jobs.delete(jobId);
      logger.debug({ jobId }, 'Cleaned up old job');
    }
  }
}, 5 * 60 * 1000);

// Start server
app.listen(PORT, '0.0.0.0', () => {
  logger.info({
    port: PORT,
    corsOrigin: corsOptions.origin,
    uploadDir: TEMP_DIR,
    maxFileSize: `${(parseInt(process.env.MAX_FILE_SIZE) || 500 * 1024 * 1024) / (1024 * 1024)}MB`,
    redisUrl: REDIS_URL,
    nodeEnv: process.env.NODE_ENV
  }, 'Unified Conversion Service started');

  console.log('\n' + '='.repeat(60));
  console.log('🚀 UNIFIED CONVERSION SERVICE');
  console.log('='.repeat(60));
  console.log(`📍 Port: ${PORT}`);
  console.log(`🌐 CORS Origin: ${corsOptions.origin}`);
  console.log(`📂 Upload Directory: ${TEMP_DIR}`);
  console.log(`📦 Max File Size: ${(parseInt(process.env.MAX_FILE_SIZE) || 500 * 1024 * 1024) / (1024 * 1024)}MB`);
  console.log(`🔴 Redis: ${REDIS_URL}`);
  console.log('\n📋 Available Services:');
  console.log('   ✓ File Conversion Service   → /api/convert (LibreOffice, xlsx)');
  console.log('   ✓ Media Conversion Service  → /api/media/convert (FFmpeg, Sharp)');
  console.log('   ✓ Filter Service            → /api/filter (Sharp)');
  console.log('\n🏥 Health Check: http://localhost:' + PORT + '/health');
  console.log('📊 Metrics: http://localhost:' + PORT + '/metrics');
  console.log('='.repeat(60) + '\n');
});

// Graceful shutdown
async function gracefulShutdown(signal) {
  logger.info({ signal }, 'Shutting down gracefully...');

  try {
    await fileWorker.close();
    await mediaWorker.close();
    await filterWorker.close();

    await fileQueue.close();
    await mediaQueue.close();
    await filterQueue.close();

    await redis.quit();

    logger.info('Shutdown complete');
    process.exit(0);
  } catch (error) {
    logger.error({ error }, 'Error during shutdown');
    process.exit(1);
  }
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error({ reason, promise }, 'Unhandled Promise Rejection');
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error({ error }, 'Uncaught Exception');
  process.exit(1);
});
