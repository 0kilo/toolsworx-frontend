require('dotenv').config();

const toInt = (val, fallback) => {
  const n = parseInt(val, 10);
  return Number.isNaN(n) ? fallback : n;
};

const parseOrigins = (val) => {
  if (!val) {
    return ['https://toolsworx.com', 'https://www.toolsworx.com', 'http://localhost:3000'];
  }
  if (val.trim() === '*') return '*';
  return val
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);
};

module.exports = {
  PORT: process.env.PORT || 3010,
  TEMP_DIR: process.env.TEMP_DIR || '/tmp/uploads',
  LIBRE_OFFICE_PATH: process.env.LIBRE_OFFICE_PATH || '/usr/bin/libreoffice',
  FFMPEG_PATH: process.env.FFMPEG_PATH || '/usr/bin/ffmpeg',
  CORS_ORIGIN: parseOrigins(process.env.CORS_ORIGIN),
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  NODE_ENV: process.env.NODE_ENV || 'production',
  MAX_FILE_SIZE: toInt(process.env.MAX_FILE_SIZE, 500 * 1024 * 1024),
  MAX_MEDIA_SIZE: toInt(process.env.MAX_MEDIA_SIZE, 800 * 1024 * 1024),
  MAX_AUDIO_SIZE: toInt(process.env.MAX_AUDIO_SIZE, 200 * 1024 * 1024),
  BASE_WINDOW_HOURS: toInt(process.env.CONVERSION_WINDOW_HOURS, 24),
  BASE_LIMIT: toInt(process.env.CONVERSION_LIMIT_NOAUTH, 3),
  GLOBAL_RATE_MAX: toInt(process.env.GLOBAL_RATE_MAX, 200),
  API_KEYS: (process.env.API_KEYS || '')
    .split(',')
    .map(k => k.trim())
    .filter(Boolean),
};
