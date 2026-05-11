import { isValidTikTokUrl, sanitizeInput, setCorsHeaders, setSecurityHeaders, logEvent } from './_lib/helpers.js';
import { getFromCache, setToCache } from './_lib/cache.js';
import { downloadVideo } from './_lib/services/downloader.js';
import { checkAuth } from './_lib/middleware/auth.js';
import { checkRateLimit } from './_lib/middleware/rateLimit.js';
import config from './_lib/config.js';

export default async function handler(req, res) {
  setCorsHeaders(res);
  setSecurityHeaders(res);

  if (req.method === 'OPTIONS') return res.status(200).end();

  const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';

  if (req.method !== 'GET' && req.method !== 'POST') {
    logEvent('WARN', 'API_INFO', 'Method Not Allowed', { ip, method: req.method });
    return res.status(405).json({ code: 'METHOD_NOT_ALLOWED', msg: 'Method Not Allowed.' });
  }

  const authErr = checkAuth(req);
  if (authErr) {
    logEvent('WARN', 'API_INFO', 'Auth Failed', { ip });
    return res.status(401).json({ code: 'UNAUTHORIZED', msg: authErr.message });
  }

  const rateErr = await checkRateLimit(ip);
  if (rateErr) {
    logEvent('WARN', 'API_INFO', 'Rate Limit Exceeded', { ip });
    return res.status(429).json({ code: 'RATE_LIMIT', msg: rateErr.message });
  }

  const rawUrl = req.method === 'POST' ? req.body?.url : req.query?.url;

  if (!isValidTikTokUrl(rawUrl)) {
    logEvent('INFO', 'API_INFO', 'Invalid URL', { ip, url: rawUrl });
    return res.status(400).json({ code: 'INVALID_URL', msg: 'Invalid TikTok URL.' });
  }

  const cleanUrl = sanitizeInput(rawUrl);
  const cacheKey = `info:${cleanUrl}`;

  try {
    const cached = await getFromCache(cacheKey);
    if (cached) {
      logEvent('INFO', 'API_INFO', 'Cache Hit', { ip, url: cleanUrl });
      return res.status(200).json({ code: 0, data: cached });
    }

    const result = await downloadVideo(cleanUrl);

    // If we reach here, it's successful (tikwm.js returns {success: true})
    const payload = { ...result, cached: false };
    await setToCache(cacheKey, payload, config.cache.ttl);

    logEvent('INFO', 'API_INFO', 'Success', { ip, url: cleanUrl });
    return res.status(200).json({ code: 0, data: payload });

  } catch (err) {
    let errorCode = 'SERVER_ERROR';
    let statusCode = 500;
    let message = err.message || 'Internal Server Error';

    if (err.message === 'PRIVATE_VIDEO' || err.message === 'DELETED_VIDEO') {
      errorCode = err.message;
      statusCode = 403; // or 404
    } else if (err.name === 'AbortError') {
      errorCode = 'TIMEOUT';
      statusCode = 504;
      message = 'Request timed out.';
    }

    logEvent('ERROR', 'API_INFO', 'Request Failed', { ip, url: cleanUrl, errorCode, error: err.message });
    return res.status(statusCode).json({ code: errorCode, msg: message });
  }
}
