const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 3000;

// CORS Configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure multer for file uploads
const upload = multer({
  dest: process.env.TEMP_DIR || '/tmp/uploads/',
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 500 * 1024 * 1024 // 500MB default
  }
});

// In-memory job storage (replace with Redis/DB in production)
const jobs = new Map();

// Utility function to create job
function createJob(type, file, options = {}) {
  const jobId = `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const job = {
    id: jobId,
    type,
    status: 'completed', // Mock: instant completion
    progress: 100,
    originalFile: file.originalname,
    createdAt: new Date().toISOString(),
    ...options
  };
  jobs.set(jobId, job);
  return job;
}

// ========================================
// HEALTH CHECK ENDPOINT
// ========================================
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'unified-conversion-service',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    services: {
      file_conversion: 'operational',
      media_conversion: 'operational',
      filter_service: 'operational'
    }
  });
});

// ========================================
// FILE CONVERSION SERVICE ENDPOINTS
// ========================================

// Convert file
app.post('/api/convert', upload.single('file'), (req, res) => {
  try {
    const { targetFormat, options } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    const job = createJob('file', file, { targetFormat });

    console.log(`✓ File conversion: ${file.originalname} → ${targetFormat} (Job: ${job.id})`);

    res.status(202).json({
      success: true,
      jobId: job.id,
      status: job.status,
      message: `File conversion initiated: ${file.originalname} to ${targetFormat}`,
      downloadUrl: `/api/download/${job.id}`
    });
  } catch (error) {
    console.error('File conversion error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get file conversion job status
app.get('/api/status/:jobId', (req, res) => {
  const { jobId } = req.params;
  const job = jobs.get(jobId);

  if (!job) {
    return res.status(404).json({
      success: false,
      error: 'Job not found'
    });
  }

  res.json({
    success: true,
    jobId: job.id,
    status: job.status,
    progress: job.progress,
    downloadUrl: job.status === 'completed' ? `/api/download/${job.id}` : undefined
  });
});

// Download converted file
app.get('/api/download/:jobId', (req, res) => {
  const { jobId } = req.params;
  const job = jobs.get(jobId);

  if (!job) {
    return res.status(404).json({
      success: false,
      error: 'Job not found'
    });
  }

  // Mock response - in production, serve actual file from S3/filesystem
  res.json({
    success: true,
    message: 'Mock download - file conversion service is operational',
    jobId: job.id,
    originalFile: job.originalFile,
    note: 'In production, this would stream the converted file'
  });
});

// ========================================
// MEDIA CONVERSION SERVICE ENDPOINTS
// ========================================

// Convert media
app.post('/api/media/convert', upload.single('file'), (req, res) => {
  try {
    const { targetFormat, options } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    const job = createJob('media', file, { targetFormat });

    console.log(`✓ Media conversion: ${file.originalname} → ${targetFormat} (Job: ${job.id})`);

    res.status(202).json({
      success: true,
      jobId: job.id,
      status: job.status,
      message: `Media conversion initiated: ${file.originalname} to ${targetFormat}`,
      downloadUrl: `/api/media/download/${job.id}`
    });
  } catch (error) {
    console.error('Media conversion error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get media conversion job status
app.get('/api/media/status/:jobId', (req, res) => {
  const { jobId } = req.params;
  const job = jobs.get(jobId);

  if (!job) {
    return res.status(404).json({
      success: false,
      error: 'Job not found'
    });
  }

  res.json({
    success: true,
    jobId: job.id,
    status: job.status,
    progress: job.progress,
    downloadUrl: job.status === 'completed' ? `/api/media/download/${job.id}` : undefined
  });
});

// Download converted media
app.get('/api/media/download/:jobId', (req, res) => {
  const { jobId } = req.params;
  const job = jobs.get(jobId);

  if (!job) {
    return res.status(404).json({
      success: false,
      error: 'Job not found'
    });
  }

  // Mock response
  res.json({
    success: true,
    message: 'Mock download - media conversion service is operational',
    jobId: job.id,
    originalFile: job.originalFile,
    note: 'In production, this would stream the converted media file'
  });
});

// ========================================
// FILTER SERVICE ENDPOINTS
// ========================================

// Apply filter
app.post('/api/filter', upload.single('file'), (req, res) => {
  try {
    const { filterType, options } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    const job = createJob('filter', file, { filterType, options });

    console.log(`✓ Filter applied: ${filterType} on ${file.originalname} (Job: ${job.id})`);

    res.status(202).json({
      success: true,
      jobId: job.id,
      status: job.status,
      message: `Filter applied: ${filterType} on ${file.originalname}`,
      downloadUrl: `/api/filter/download/${job.id}`
    });
  } catch (error) {
    console.error('Filter application error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get filter job status
app.get('/api/filter/status/:jobId', (req, res) => {
  const { jobId } = req.params;
  const job = jobs.get(jobId);

  if (!job) {
    return res.status(404).json({
      success: false,
      error: 'Job not found'
    });
  }

  res.json({
    success: true,
    jobId: job.id,
    status: job.status,
    progress: job.progress,
    downloadUrl: job.status === 'completed' ? `/api/filter/download/${job.id}` : undefined
  });
});

// Download filtered file
app.get('/api/filter/download/:jobId', (req, res) => {
  const { jobId } = req.params;
  const job = jobs.get(jobId);

  if (!job) {
    return res.status(404).json({
      success: false,
      error: 'Job not found'
    });
  }

  // Mock response
  res.json({
    success: true,
    message: 'Mock download - filter service is operational',
    jobId: job.id,
    originalFile: job.originalFile,
    note: 'In production, this would stream the filtered file'
  });
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
  console.error('Unhandled error:', err);
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
setInterval(() => {
  const now = Date.now();
  const oneHour = 60 * 60 * 1000;

  for (const [jobId, job] of jobs.entries()) {
    const jobAge = now - new Date(job.createdAt).getTime();
    if (jobAge > oneHour) {
      jobs.delete(jobId);
      console.log(`🗑️  Cleaned up old job: ${jobId}`);
    }
  }
}, 5 * 60 * 1000);

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log('\n' + '='.repeat(60));
  console.log('🚀 UNIFIED CONVERSION SERVICE');
  console.log('='.repeat(60));
  console.log(`📍 Port: ${PORT}`);
  console.log(`🌐 CORS Origin: ${corsOptions.origin}`);
  console.log(`📂 Upload Directory: ${process.env.TEMP_DIR || '/tmp/uploads/'}`);
  console.log(`📦 Max File Size: ${(parseInt(process.env.MAX_FILE_SIZE) || 500 * 1024 * 1024) / (1024 * 1024)}MB`);
  console.log('\n📋 Available Services:');
  console.log('   ✓ File Conversion Service   → /api/convert');
  console.log('   ✓ Media Conversion Service  → /api/media/convert');
  console.log('   ✓ Filter Service            → /api/filter');
  console.log('\n🏥 Health Check: http://localhost:' + PORT + '/health');
  console.log('='.repeat(60) + '\n');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\nSIGINT received, shutting down gracefully...');
  process.exit(0);
});
