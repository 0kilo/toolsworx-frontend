import { exec } from 'child_process'
import { promisify } from 'util'
import { config } from '../config'

const execAsync = promisify(exec)

export class HealthChecker {
  async checkHealth() {
    const checks = await Promise.allSettled([
      this.checkLibreOffice(),
      this.checkDiskSpace(),
      this.checkMemory(),
    ])

    const results = checks.map((check, index) => ({
      service: ['libreoffice', 'disk', 'memory'][index],
      status: check.status === 'fulfilled' ? 'healthy' : 'unhealthy',
      error: check.status === 'rejected' ? (check.reason as Error).message : null,
    }))

    return {
      status: results.every((r) => r.status === 'healthy') ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      services: results,
    }
  }

  private async checkLibreOffice(): Promise<void> {
    try {
      await execAsync(`${config.libreOfficePath} --version`)
    } catch (error) {
      throw new Error('LibreOffice not available')
    }
  }

  private async checkDiskSpace(): Promise<void> {
    // Simplified disk space check
    const minRequired = 1024 * 1024 * 1024 // 1GB
    // In production, implement actual disk space check
    return Promise.resolve()
  }

  private async checkMemory(): Promise<void> {
    const usage = process.memoryUsage()
    const maxMemory = 2 * 1024 * 1024 * 1024 // 2GB

    if (usage.heapUsed > maxMemory) {
      throw new Error('Memory usage too high')
    }
  }
}
