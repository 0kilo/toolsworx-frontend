import dotenv from 'dotenv'

dotenv.config()

export const config = {
  // Server
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || '*',

  // Redis
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',

  // File limits
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '524288000', 10), // 500MB default
  tempFileRetention: process.env.TEMP_FILE_RETENTION || '24h',
  outputFileRetention: process.env.OUTPUT_FILE_RETENTION || '7d',

  // Processing
  libreOfficePath: process.env.LIBRE_OFFICE_PATH || '/usr/bin/libreoffice',
  pandocPath: process.env.PANDOC_PATH || '/usr/bin/pandoc',
  tempDir: process.env.TEMP_DIR || '/tmp/file-conversions',

  // Rate limiting
  rateLimits: {
    anonymous: {
      requestsPerHour: 20,
      maxFileSizeMB: 25,
      concurrentJobs: 1,
      allowedFormats: ['pdf', 'docx', 'txt', 'csv', 'json'],
    },
    registered: {
      requestsPerHour: 100,
      maxFileSizeMB: 100,
      concurrentJobs: 3,
      allowedFormats: 'all',
    },
    premium: {
      requestsPerHour: 500,
      maxFileSizeMB: 500,
      concurrentJobs: 10,
      allowedFormats: 'all',
      priorityProcessing: true,
    },
  },

  // Job queue
  queue: {
    maxAttempts: 3,
    backoffDelay: 2000,
    removeOnComplete: 100,
    removeOnFail: 50,
  },
}

export type Config = typeof config
