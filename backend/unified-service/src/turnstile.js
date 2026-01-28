const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

async function verifyTurnstile(req, res, next) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return next();

  const token = req.body?.turnstileToken || req.headers['cf-turnstile-response'];
  if (!token) {
    return res.status(400).json({ success: false, error: 'Missing Turnstile token' });
  }

  try {
    const params = new URLSearchParams();
    params.set('secret', secret);
    params.set('response', token);
    if (req.ip) params.set('remoteip', req.ip);

    const resp = await fetch(TURNSTILE_VERIFY_URL, {
      method: 'POST',
      body: params
    });
    if (!resp.ok) {
      return res.status(502).json({ success: false, error: 'Turnstile verification failed' });
    }

    const data = await resp.json();
    if (!data.success) {
      return res.status(403).json({ success: false, error: 'Turnstile rejected', codes: data['error-codes'] });
    }

    return next();
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Turnstile verification error', message: error.message });
  }
}

module.exports = { verifyTurnstile };
