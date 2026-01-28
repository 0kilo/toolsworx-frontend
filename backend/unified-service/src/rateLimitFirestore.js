const crypto = require('crypto');
const admin = require('firebase-admin');
const { getFirestore } = require('./firebase');
const { BASE_LIMIT, BASE_WINDOW_HOURS, API_KEYS } = require('./config');

const WINDOW_MS = BASE_WINDOW_HOURS * 60 * 60 * 1000;

function isApiKeyValid(key) {
  return API_KEYS.includes(key);
}

function getFingerprint(req) {
  const ip = req.ip || '';
  const ua = req.headers['user-agent'] || '';
  return crypto.createHash('sha256').update(`${ip}|${ua}`).digest('hex');
}

async function conversionRateLimiter(req, res, next) {
  try {
    const apiKey = req.headers['x-api-key'];
    if (apiKey && isApiKeyValid(apiKey)) {
      return next();
    }

    const db = getFirestore();
    const fingerprint = getFingerprint(req);
    const docId = `anon_${fingerprint}`;
    const ref = db.collection('conversionLimits').doc(docId);
    const nowMs = Date.now();

    let result;
    await db.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      if (!snap.exists) {
        const resetAtMs = nowMs + WINDOW_MS;
        tx.set(ref, {
          count: 1,
          resetAt: admin.firestore.Timestamp.fromMillis(resetAtMs),
          updatedAt: admin.firestore.Timestamp.fromMillis(nowMs),
          type: 'anon',
          windowHours: BASE_WINDOW_HOURS
        });
        result = { allowed: true, resetAtMs };
        return;
      }

      const data = snap.data() || {};
      const resetAtMs = data.resetAt?.toMillis ? data.resetAt.toMillis() : data.resetAt;
      if (!resetAtMs || resetAtMs <= nowMs) {
        const nextResetAtMs = nowMs + WINDOW_MS;
        tx.set(ref, {
          count: 1,
          resetAt: admin.firestore.Timestamp.fromMillis(nextResetAtMs),
          updatedAt: admin.firestore.Timestamp.fromMillis(nowMs),
          type: 'anon',
          windowHours: BASE_WINDOW_HOURS
        });
        result = { allowed: true, resetAtMs: nextResetAtMs };
        return;
      }

      const count = Number(data.count || 0);
      if (count >= BASE_LIMIT) {
        result = { allowed: false, resetAtMs };
        return;
      }

      tx.update(ref, {
        count: count + 1,
        updatedAt: admin.firestore.Timestamp.fromMillis(nowMs)
      });
      result = { allowed: true, resetAtMs };
    });

    if (!result?.allowed) {
      return res.status(429).json({
        success: false,
        error: 'Daily limit reached',
        limit: BASE_LIMIT,
        resetAt: new Date(result.resetAtMs).toISOString()
      });
    }

    return next();
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Rate limiter failure', message: error.message });
  }
}

module.exports = { conversionRateLimiter };
