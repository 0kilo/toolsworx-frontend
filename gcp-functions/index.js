'use strict';

const { Firestore } = require('@google-cloud/firestore');

const firestore = new Firestore();
const cacheDocRef = firestore.collection('market_cache').doc('latest');

const CRYPTO_MIN_INTERVAL_MS = 5 * 60 * 1000;
const CURRENCY_MIN_INTERVAL_MS = 30 * 60 * 1000;
const COINGECKO_URL = 'https://api.coingecko.com/api/v3/simple/price';

const COINGECKO_IDS = 'bitcoin,ethereum,binancecoin,ripple,cardano,dogecoin,solana,tether,usd-coin,tron';

function toMillis(isoValue) {
  if (!isoValue) return 0;
  const parsed = Date.parse(isoValue);
  return Number.isFinite(parsed) ? parsed : 0;
}

function isDue(lastUpdatedIso, minIntervalMs, nowMs) {
  const last = toMillis(lastUpdatedIso);
  if (!last) return true;
  return nowMs - last >= minIntervalMs;
}

async function fetchCoinGecko() {
  const apiKey = process.env.COINGECKO_API_KEY;
  const url = new URL(COINGECKO_URL);
  url.searchParams.set('ids', COINGECKO_IDS);
  url.searchParams.set('vs_currencies', 'usd');
  url.searchParams.set('include_market_cap', 'false');
  url.searchParams.set('include_24hr_vol', 'false');
  url.searchParams.set('include_24hr_change', 'false');

  const headers = {};
  if (apiKey) headers['x-cg-demo-api-key'] = apiKey;

  const response = await fetch(url.toString(), { headers });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`CoinGecko failed (${response.status}): ${body.slice(0, 500)}`);
  }

  return response.json();
}

async function fetchExchangeRates() {
  const apiKey = process.env.EXCHANGERATE_API_KEY;
  if (!apiKey) throw new Error('EXCHANGERATE_API_KEY is not set');

  const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`;
  const response = await fetch(url);
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`ExchangeRate API failed (${response.status}): ${body.slice(0, 500)}`);
  }

  const data = await response.json();
  if (data.result && data.result !== 'success') {
    throw new Error(`ExchangeRate API error: ${JSON.stringify(data).slice(0, 500)}`);
  }

  return data;
}

async function getCache() {
  const snap = await cacheDocRef.get();
  if (!snap.exists) return null;
  return snap.data();
}

function sendJson(res, code, payload) {
  res.status(code).set('Content-Type', 'application/json; charset=utf-8').send(JSON.stringify(payload));
}

function unauthorized(res) {
  sendJson(res, 401, { ok: false, error: 'Unauthorized refresh request' });
}

async function handleRates(req, res) {
  const cache = await getCache();
  if (!cache) {
    return sendJson(res, 404, {
      ok: false,
      error: 'No cached rates yet. Run POST /refresh first.',
    });
  }

  const now = Date.now();
  const cryptoAgeSeconds = Math.floor((now - toMillis(cache.cryptoUpdatedAt)) / 1000);
  const currencyAgeSeconds = Math.floor((now - toMillis(cache.currencyUpdatedAt)) / 1000);

  return sendJson(res, 200, {
    ok: true,
    cryptoUpdatedAt: cache.cryptoUpdatedAt || null,
    currencyUpdatedAt: cache.currencyUpdatedAt || null,
    cryptoAgeSeconds: Number.isFinite(cryptoAgeSeconds) ? cryptoAgeSeconds : null,
    currencyAgeSeconds: Number.isFinite(currencyAgeSeconds) ? currencyAgeSeconds : null,
    crypto: cache.crypto || null,
    currency: cache.currency || null,
  });
}

async function handleRefresh(req, res) {
  const expectedToken = process.env.REFRESH_TOKEN || '';
  if (expectedToken) {
    const providedToken = req.get('x-refresh-token') || '';
    if (providedToken !== expectedToken) return unauthorized(res);
  }

  const nowIso = new Date().toISOString();
  const nowMs = Date.now();
  const current = (await getCache()) || {};
  const next = { ...current };

  let updated = false;
  const refreshed = {
    crypto: false,
    currency: false,
  };
  const errors = [];

  if (isDue(current.cryptoUpdatedAt, CRYPTO_MIN_INTERVAL_MS, nowMs)) {
    try {
      next.crypto = await fetchCoinGecko();
      next.cryptoUpdatedAt = nowIso;
      refreshed.crypto = true;
      updated = true;
    } catch (error) {
      errors.push(`crypto: ${error.message}`);
    }
  }

  if (isDue(current.currencyUpdatedAt, CURRENCY_MIN_INTERVAL_MS, nowMs)) {
    try {
      next.currency = await fetchExchangeRates();
      next.currencyUpdatedAt = nowIso;
      refreshed.currency = true;
      updated = true;
    } catch (error) {
      errors.push(`currency: ${error.message}`);
    }
  }

  if (updated) {
    next.updatedAt = nowIso;
    await cacheDocRef.set(next, { merge: true });
  }

  const statusCode = errors.length > 0 && !updated ? 502 : 200;
  return sendJson(res, statusCode, {
    ok: statusCode === 200,
    refreshed,
    skipped: {
      crypto: !refreshed.crypto,
      currency: !refreshed.currency,
    },
    cryptoUpdatedAt: next.cryptoUpdatedAt || null,
    currencyUpdatedAt: next.currencyUpdatedAt || null,
    errors,
  });
}

exports.ratesApi = async (req, res) => {
  try {
    if (req.method === 'GET' && req.path === '/health') {
      return sendJson(res, 200, { ok: true, service: 'rates-api' });
    }

    if (req.method === 'GET' && req.path === '/rates') {
      return handleRates(req, res);
    }

    if (req.method === 'POST' && req.path === '/refresh') {
      return handleRefresh(req, res);
    }

    return sendJson(res, 404, {
      ok: false,
      error: 'Not found. Use GET /health, GET /rates, POST /refresh',
    });
  } catch (error) {
    return sendJson(res, 500, {
      ok: false,
      error: error.message,
    });
  }
};
