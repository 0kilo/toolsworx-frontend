const promClient = require('prom-client');

const register = new promClient.Registry();
promClient.collectDefaultMetrics({ register });

const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register]
});

const conversionCounter = new promClient.Counter({
  name: 'conversions_total',
  help: 'Total number of conversions processed',
  labelNames: ['type', 'status'],
  registers: [register]
});

const activeJobsGauge = new promClient.Gauge({
  name: 'active_jobs',
  help: 'Number of currently active jobs',
  labelNames: ['type'],
  registers: [register]
});

module.exports = {
  register,
  httpRequestDuration,
  conversionCounter,
  activeJobsGauge,
};
