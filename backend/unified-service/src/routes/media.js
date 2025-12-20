const express = require('express');
const path = require('path');
const { createReadStream } = require('fs');
const { conversionLimiter } = require('../rateLimit');

module.exports = ({ uploadAny, mediaQueue, jobs, logger }) => {
  const router = express.Router();

  router.post('/api/media/convert', conversionLimiter, uploadAny.single('file'), async (req, res) => {
    try {
      const { targetFormat, options } = req.body;
      const file = req.file;
      if (!file) return res.status(400).json({ success: false, error: 'No file uploaded' });

      const jobId = require('uuid').v4();
      const inputExt = path.extname(file.originalname).toLowerCase().slice(1);

      const job = await mediaQueue.add('convert', {
        jobId,
        inputPath: file.path,
        targetFormat,
        inputExt,
        options: options ? JSON.parse(options) : {}
      });

      jobs.set(job.id, { type: 'media', status: 'queued', originalFile: file.originalname, createdAt: Date.now() });
      logger.info({ jobId: job.id, file: file.originalname, targetFormat, type: 'media' }, 'Media conversion queued');

      res.status(202).json({
        success: true,
        jobId: job.id,
        status: 'queued',
        message: `Media conversion queued: ${file.originalname} to ${targetFormat}`,
        downloadUrl: `/api/media/download/${job.id}`
      });
    } catch (error) {
      logger.error({ error }, 'Media conversion request error');
      res.status(500).json({ success: false, error: error.message });
    }
  });

  router.get('/api/media/status/:jobId', async (req, res) => {
    const { jobId } = req.params;
    try {
      const job = await mediaQueue.getJob(jobId);
      if (!job) return res.status(404).json({ success: false, error: 'Job not found' });
      const state = await job.getState();
      const progress = job.progress || 0;
      const error = state === 'failed' ? (job.failedReason || (job.stacktrace && job.stacktrace[0])) : undefined;
      res.json({
        success: true,
        jobId: job.id,
        status: state,
        progress,
        error,
        downloadUrl: state === 'completed' ? `/api/media/download/${job.id}` : undefined
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  router.get('/api/media/download/:jobId', async (req, res) => {
    const { jobId } = req.params;
    try {
      const job = await mediaQueue.getJob(jobId);
      if (!job) return res.status(404).json({ success: false, error: 'Job not found' });
      const state = await job.getState();
      if (state !== 'completed') return res.status(400).json({ success: false, error: 'Media file not ready for download' });
      const result = job.returnvalue;
      const stream = createReadStream(result.outputPath);
      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-Disposition', `attachment; filename="converted${path.extname(result.outputPath)}"`);
      stream.pipe(res);
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  return router;
};
