const rateLimit = require('express-rate-limit');
const { BASE_WINDOW_HOURS, BASE_LIMIT, GLOBAL_RATE_MAX, API_KEYS } = require('./config');

function isApiKeyValid(key) {
  return API_KEYS.includes(key);
}

function getClientId(req) {
  const apiKey = req.headers['x-api-key'];
  if (apiKey && isApiKeyValid(apiKey)) return `apikey:${apiKey}`;
  const sessionHeader = req.headers['x-session-id'];
  if (sessionHeader) return `session:${sessionHeader}`;
  return `ip:${req.ip}`;
}

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: GLOBAL_RATE_MAX,
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const conversionLimiter = rateLimit({
  windowMs: BASE_WINDOW_HOURS * 60 * 60 * 1000,
  max: (req) => {
    const apiKey = req.headers['x-api-key'];
    return apiKey && isApiKeyValid(apiKey) ? Number.MAX_SAFE_INTEGER : BASE_LIMIT;
  },
  keyGenerator: getClientId,
  message: 'Rate limit exceeded. Authenticate or wait before submitting more conversions.',
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  globalLimiter,
  conversionLimiter,
  getClientId,
  isApiKeyValid,
};
