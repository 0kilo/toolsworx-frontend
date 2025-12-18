const pino = require('pino');
const { LOG_LEVEL, NODE_ENV } = require('./config');

const logger = pino({
  level: LOG_LEVEL,
  transport: NODE_ENV === 'development' ? {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'HH:MM:ss Z',
      ignore: 'pid,hostname'
    }
  } : undefined
});

module.exports = { logger };
