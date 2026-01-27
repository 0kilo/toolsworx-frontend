const crypto = require('crypto');
const { getFirestore } = require('../firebase');

function parseApiKey(apiKey) {
  if (!apiKey) return null;
  const match = apiKey.match(/^twx_([a-z0-9-]+)_([A-Za-z0-9_-]+)\.([A-Za-z0-9_-]+)$/);
  if (!match) return null;
  return { env: match[1], publicId: match[2], secret: match[3] };
}

function hashSecret(secret) {
  return crypto.createHash('sha256').update(secret, 'utf8').digest('hex');
}

async function isApiKeyValid(apiKey) {
  const parsed = parseApiKey(apiKey);
  if (!parsed) return false;
  const db = getFirestore();
  const doc = await db.collection('apiKeys').doc(parsed.publicId).get();
  if (!doc.exists) return false;
  const data = doc.data() || {};
  if (data.active === false) return false;
  if (!data.secretHash) return false;
  return data.secretHash === hashSecret(parsed.secret);
}

function extractApiKey(req) {
  const headerKey = req.get('x-api-key');
  if (headerKey) return headerKey.trim();
  const auth = req.get('authorization');
  if (!auth) return '';
  const match = auth.match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : '';
}

module.exports = { isApiKeyValid, extractApiKey };
