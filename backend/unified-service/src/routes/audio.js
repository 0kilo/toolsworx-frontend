const express = require('express');
const path = require('path');
const { createReadStream } = require('fs');
const { conversionLimiter } = require('../rateLimit');

module.exports = ({ uploadAudioOnly, audioFilterQueue, jobs, logger }) => {
  const router = express.Router();

  router.post('/api/audio/filter', conversionLimiter, uploadAudioOnly.single('file'), async (req, res) => {
    try {
      const { filterType, options } = req.body;
      const file = req.file;
      if (!file) return res.status(400).json({ success: false, error: 'No file uploaded' });
      if (!filterType) return res.status(400).json({ success: false, error: 'filterType is required' });

      const jobId = require('uuid').v4();
      const job = await audioFilterQueue.add('audio-filter', {
        jobId,
        inputPath: file.path,
        filterType,
        options: options ? JSON.parse(options) : {}
      });

      jobs.set(job.id, { type: 'audio', status: 'queued', originalFile: file.originalname, createdAt: Date.now() });
      logger.info({ jobId: job.id, file: file.originalname, filterType, type: 'audio' }, 'Audio filter queued');

      res.status(202).json({
        success: true,
        jobId: job.id,
        status: 'queued',
        message: `Audio filter queued: ${filterType}`,
        downloadUrl: `/api/audio/download/${job.id}`
      });
    } catch (error) {
      logger.error({ error }, 'Audio filter request error');
      res.status(500).json({ success: false, error: error.message });
    }
  });

  router.get('/api/audio/status/:jobId', async (req, res) => {
    const { jobId } = req.params;
    try {
      const job = await audioFilterQueue.getJob(jobId);
      if (!job) return res.status(404).json({ success: false, error: 'Job not found' });
      const state = await job.getState();
      const progress = job.progress || 0;
      res.json({
        success: true,
        jobId: job.id,
        status: state,
        progress,
        downloadUrl: state === 'completed' ? `/api/audio/download/${job.id}` : undefined
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  router.get('/api/audio/download/:jobId', async (req, res) => {
    const { jobId } = req.params;
    try {
      const job = await audioFilterQueue.getJob(jobId);
      if (!job) return res.status(404).json({ success: false, error: 'Job not found' });
      const state = await job.getState();
      if (state !== 'completed') return res.status(400).json({ success: false, error: 'Audio not ready for download' });
      const result = job.returnvalue;
      const stream = createReadStream(result.outputPath);
      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-Disposition', `attachment; filename="filtered${path.extname(result.outputPath)}"`);
      stream.pipe(res);
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  return router;
};
