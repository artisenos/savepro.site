import { isValidTikTokUrl, sanitizeInput, setCorsHeaders, setSecurityHeaders } from './_lib/helpers.js';
import { getFromCache, setToCache } from './_lib/cache.js';
import { downloadVideo } from './_lib/services/downloader.js';
import { checkAuth } from './_lib/middleware/auth.js';
import { checkRateLimit } from './_lib/middleware/rateLimit.js';
import config from './_lib/config.js';

export default async function handler(req, res) {
  setCorsHeaders(res);
  setSecurityHeaders(res);

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed. Use GET.' });
  }

  const authErr = checkAuth(req);
  if (authErr) return res.status(401).json(authErr);

  const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
  const rateErr = await checkRateLimit(ip);
  if (rateErr) return res.status(429).json(rateErr);

  const rawUrl = req.query?.url || '';

  if (!isValidTikTokUrl(rawUrl)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid TikTok URL.',
    });
  }

  const cleanUrl = sanitizeInput(rawUrl);
  const cacheKey = `info:${cleanUrl}`;

  const cached = await getFromCache(cacheKey);
  if (cached) return res.status(200).json(cached);

  try {
    const result = await downloadVideo(cleanUrl, { failFast: false });

    const payload = {
      success: result.success,
      source: result.source,
      title: result.title,
      author: result.author,
      cover: result.cover,
      duration: result.duration,
      stats: result.stats,
      cached: false,
    };

    await setToCache(cacheKey, payload, config.cache.ttl);

    return res.status(200).json(payload);
  } catch (err) {
    return res.status(502).json({
      success: false,
      message: 'Failed to fetch video info.',
      error: err.message,
    });
  }
}
