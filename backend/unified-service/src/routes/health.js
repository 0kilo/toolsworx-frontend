const express = require('express');
const router = express.Router();

module.exports = (deps) => {
  router.get('/health', async (req, res) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'unified-conversion-service',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    });
  });

  router.get('/ready', (req, res) => {
    res.json({ ready: true, timestamp: new Date().toISOString() });
  });

  router.get('/metrics', async (req, res) => {
    try {
      res.set('Content-Type', deps.metrics.register.contentType);
      res.end(await deps.metrics.register.metrics());
    } catch (error) {
      res.status(500).end(error);
    }
  });

  return router;
};
