const express = require('express');
const cors = require('cors');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true
}));
app.use(express.json());

const upload = multer({ 
  dest: '/tmp/uploads/',
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'filter-service'
  });
});

// Apply filter endpoint (mock)
app.post('/api/filter', upload.single('file'), (req, res) => {
  try {
    const { filterType, options } = req.body;
    const file = req.file;
    
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const jobId = Date.now().toString();
    
    setTimeout(() => {
      console.log(`Mock filter applied for job ${jobId}: ${filterType} on ${file.originalname}`);
    }, 1500);

    res.status(202).json({
      jobId,
      status: 'completed',
      message: `Mock filter applied: ${filterType} on ${file.originalname}`,
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
    message: 'Mock filter application completed'
  });
});

app.get('/api/download/:jobId', (req, res) => {
  const { jobId } = req.params;
  res.json({
    message: 'Mock download - filter service is running',
    jobId,
    note: 'This is a development mock. Real image filtering will be implemented with Sharp/VIPS.'
  });
});

app.listen(PORT, () => {
  console.log(`🎨 Filter Service running on port ${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
});