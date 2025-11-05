import { Counter, Histogram, Gauge, Registry, collectDefaultMetrics } from 'prom-client'

export class MetricsCollector {
  private registry: Registry
  private jobsTotal: Counter
  private jobDuration: Histogram
  private fileSize: Histogram
  private memoryUsage: Gauge

  constructor() {
    this.registry = new Registry()

    // Collect default metrics
    collectDefaultMetrics({ register: this.registry })

    this.jobsTotal = new Counter({
      name: 'file_conversions_total',
      help: 'Total file conversions',
      labelNames: ['type', 'status', 'user_tier'],
      registers: [this.registry],
    })

    this.jobDuration = new Histogram({
      name: 'file_conversion_duration_seconds',
      help: 'File conversion duration',
      labelNames: ['type'],
      buckets: [0.1, 0.5, 1, 5, 10, 30, 60, 300],
      registers: [this.registry],
    })

    this.fileSize = new Histogram({
      name: 'file_size_bytes',
      help: 'Size of processed files',
      buckets: [1024, 10240, 102400, 1048576, 10485760, 104857600],
      registers: [this.registry],
    })

    this.memoryUsage = new Gauge({
      name: 'memory_usage_bytes',
      help: 'Current memory usage',
      registers: [this.registry],
    })

    // Update memory usage every 10 seconds
    setInterval(() => {
      const usage = process.memoryUsage()
      this.memoryUsage.set(usage.heapUsed)
    }, 10000)
  }

  recordJobStart(type: string, userTier: string, fileSize: number) {
    this.jobsTotal.inc({ type, status: 'started', user_tier: userTier })
    this.fileSize.observe(fileSize)
  }

  recordJobComplete(type: string, userTier: string, duration: number) {
    this.jobsTotal.inc({ type, status: 'completed', user_tier: userTier })
    this.jobDuration.observe({ type }, duration)
  }

  async getMetrics(): Promise<string> {
    return this.registry.metrics()
  }
}
