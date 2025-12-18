const express = require('express');
const path = require('path');
const { createReadStream } = require('fs');
const { conversionLimiter } = require('../rateLimit');

module.exports = ({ uploadFileOnly, fileQueue, jobs, logger }) => {
  const router = express.Router();

  router.post('/api/convert', conversionLimiter, uploadFileOnly.single('file'), async (req, res) => {
    try {
      const { targetFormat, options } = req.body;
      const file = req.file;

      if (!file) {
        return res.status(400).json({ success: false, error: 'No file uploaded' });
      }

      const jobId = require('uuid').v4();
      const inputExt = path.extname(file.originalname).toLowerCase().slice(1);

      const job = await fileQueue.add('convert', {
        jobId,
        inputPath: file.path,
        targetFormat,
        inputExt,
        options: options ? JSON.parse(options) : {}
      });

    jobs.set(job.id, { type: 'file', status: 'queued', originalFile: file.originalname, createdAt: Date.now() });

      logger.info({ jobId: job.id, file: file.originalname, targetFormat, type: 'file' }, 'File conversion queued');

      res.status(202).json({
        success: true,
        jobId: job.id,
        status: 'queued',
        message: `File conversion queued: ${file.originalname} to ${targetFormat}`,
        downloadUrl: `/api/download/${job.id}`
      });
    } catch (error) {
      logger.error({ error }, 'File conversion request error');
      res.status(500).json({ success: false, error: error.message });
    }
  });

  router.get('/api/status/:jobId', async (req, res) => {
    const { jobId } = req.params;
    try {
      const job = await fileQueue.getJob(jobId);
      if (!job) return res.status(404).json({ success: false, error: 'Job not found' });
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

  router.get('/api/download/:jobId', async (req, res) => {
    const { jobId } = req.params;
    try {
      const job = await fileQueue.getJob(jobId);
      if (!job) return res.status(404).json({ success: false, error: 'Job not found' });
      const state = await job.getState();
      if (state !== 'completed') {
        return res.status(400).json({ success: false, error: 'File not ready for download' });
      }
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
