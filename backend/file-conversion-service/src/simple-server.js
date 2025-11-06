const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true
}));
app.use(express.json());

// File upload middleware
const upload = multer({ 
  dest: '/tmp/uploads/',
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'file-conversion-service'
  });
});

// Convert endpoint (mock for now)
app.post('/api/convert', upload.single('file'), (req, res) => {
  try {
    const { targetFormat } = req.body;
    const file = req.file;
    
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const jobId = Date.now().toString();
    
    // Mock conversion - just return success
    setTimeout(() => {
      console.log(`Mock conversion completed for job ${jobId}: ${file.originalname} -> ${targetFormat}`);
    }, 1000);

    res.status(202).json({
      jobId,
      status: 'completed',
      message: `Mock conversion: ${file.originalname} to ${targetFormat}`,
      downloadUrl: `/api/download/${jobId}`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Status endpoint
app.get('/api/status/:jobId', (req, res) => {
  const { jobId } = req.params;
  res.json({
    jobId,
    status: 'completed',
    progress: 100,
    message: 'Mock conversion completed'
  });
});

// Download endpoint (mock)
app.get('/api/download/:jobId', (req, res) => {
  const { jobId } = req.params;
  res.json({
    message: 'Mock download - file conversion service is running',
    jobId,
    note: 'This is a development mock. Real file conversion will be implemented with LibreOffice.'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 File Conversion Service running on port ${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
});