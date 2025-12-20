const express = require('express');
const path = require('path');
const { createReadStream } = require('fs');
const { conversionLimiter } = require('../rateLimit');

module.exports = ({ uploadAny, filterQueue, jobs, logger }) => {
  const router = express.Router();

  router.post('/api/filter', conversionLimiter, uploadAny.single('file'), async (req, res) => {
    try {
      const { filterType, filters, outputFormat } = req.body;
      const file = req.file;
      if (!file) return res.status(400).json({ success: false, error: 'No file uploaded' });

      const jobId = require('uuid').v4();
      let parsedFilters = [];
      if (filters) parsedFilters = JSON.parse(filters);
      else if (filterType) parsedFilters = [{ type: filterType }];

      const job = await filterQueue.add('apply-filters', {
        jobId,
        inputPath: file.path,
        filters: parsedFilters,
        outputFormat: outputFormat || 'jpeg'
      });

    jobs.set(job.id, { type: 'filter', status: 'queued', originalFile: file.originalname, createdAt: Date.now() });
      logger.info({ jobId: job.id, file: file.originalname, filters: parsedFilters.map(f => f.type).join(', '), type: 'filter' }, 'Filter queued');

      res.status(202).json({
        success: true,
        jobId: job.id,
        status: 'queued',
        message: 'Filter processing queued',
        downloadUrl: `/api/filter/download/${job.id}`
      });
    } catch (error) {
      logger.error({ error }, 'Filter application error');
      res.status(500).json({ success: false, error: error.message });
    }
  });

  router.get('/api/filter/status/:jobId', async (req, res) => {
    const { jobId } = req.params;
    try {
      const job = await filterQueue.getJob(jobId);
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
        downloadUrl: state === 'completed' ? `/api/filter/download/${job.id}` : undefined
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  router.get('/api/filter/download/:jobId', async (req, res) => {
    const { jobId } = req.params;
    try {
      const job = await filterQueue.getJob(jobId);
      if (!job) return res.status(404).json({ success: false, error: 'Job not found' });
      const state = await job.getState();
      if (state !== 'completed') return res.status(400).json({ success: false, error: 'Filtered file not ready for download' });
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
