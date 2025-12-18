const express = require('express');
const router = express.Router();

module.exports = (deps) => {
  const { redis } = deps;

  router.get('/health', async (req, res) => {
    try {
      await redis.ping();
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'unified-conversion-service',
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        redis: 'connected',
      });
    } catch (error) {
      res.status(503).json({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error.message,
      });
    }
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
