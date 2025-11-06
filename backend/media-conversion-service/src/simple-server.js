const express = require('express');
const cors = require('cors');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true
}));
app.use(express.json());

const upload = multer({ 
  dest: '/tmp/uploads/',
  limits: { fileSize: 500 * 1024 * 1024 } // 500MB
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'media-conversion-service'
  });
});

// Convert endpoint (mock)
app.post('/api/convert', upload.single('file'), (req, res) => {
  try {
    const { targetFormat } = req.body;
    const file = req.file;
    
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const jobId = Date.now().toString();
    
    setTimeout(() => {
      console.log(`Mock media conversion completed for job ${jobId}: ${file.originalname} -> ${targetFormat}`);
    }, 2000);

    res.status(202).json({
      jobId,
      status: 'completed',
      message: `Mock media conversion: ${file.originalname} to ${targetFormat}`,
      downloadUrl: `/api/download/${jobId}`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/status/:jobId', (req, res) => {
  const { jobId } = req.params;
  res.json({
    jobId,
    status: 'completed',
    progress: 100,
    message: 'Mock media conversion completed'
  });
});

app.get('/api/download/:jobId', (req, res) => {
  const { jobId } = req.params;
  res.json({
    message: 'Mock download - media conversion service is running',
    jobId,
    note: 'This is a development mock. Real media conversion will be implemented with FFmpeg.'
  });
});

app.listen(PORT, () => {
  console.log(`🎬 Media Conversion Service running on port ${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
});