import { setCorsHeaders, setSecurityHeaders, logEvent } from './_lib/helpers.js';
import config from './_lib/config.js';

/**
 * API Handler for Secure Media Downloading (Proxy)
 */
export default async function handler(req, res) {
  setCorsHeaders(res);
  setSecurityHeaders(res);

  if (req.method === 'OPTIONS') return res.status(200).end();

  const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
  const referrer = req.headers.referer || req.headers.origin || '';

  // 1. Basic Security: Referrer Check to prevent hotlinking
  // In development, we allow localhost. In production, we check against config.cors.origin or a whitelist.
  const isAllowed = process.env.NODE_ENV === 'development' || 
                    (referrer && referrer.includes(config.cors.origin.replace('*', '')));

  if (!isAllowed && config.cors.origin !== '*') {
    logEvent('WARN', 'API_DOWNLOAD', 'Hotlinking Blocked', { ip, referrer });
    return res.status(403).json({ code: 'FORBIDDEN', msg: 'Direct access not allowed.' });
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ code: 'METHOD_NOT_ALLOWED', msg: 'Method Not Allowed.' });
  }

  const { url, type } = req.query;

  if (!url) {
    return res.status(400).json({ code: 'INVALID_PARAMS', msg: 'Missing media URL.' });
  }

  try {
    logEvent('INFO', 'API_DOWNLOAD', 'Starting Proxy', { ip, type, url: url.substring(0, 100) });

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
      }
    });

    if (!response.ok) {
      logEvent('ERROR', 'API_DOWNLOAD', 'Source Fetch Failed', { ip, status: response.status, url: url.substring(0, 100) });
      throw new Error(`Source returned ${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    const contentLength = response.headers.get('content-length');

    res.setHeader('Content-Type', contentType || (type === 'music' ? 'audio/mpeg' : 'video/mp4'));
    if (contentLength) res.setHeader('Content-Length', contentLength);
    
    const extension = type === 'music' ? 'mp3' : 'mp4';
    res.setHeader('Content-Disposition', `attachment; filename="savepro-${type || 'media'}-${Date.now()}.${extension}"`);

    // Use a stream if possible, otherwise buffer
    if (response.body) {
      if (typeof response.body.pipe === 'function') {
        response.body.pipe(res);
      } else {
        // Native Node.js fetch returns a Web Stream (ReadableStream)
        // We need to convert it to a Node.js Readable stream
        const { Readable } = await import('stream');
        Readable.fromWeb(response.body).pipe(res);
      }
    } else {
      throw new Error('Empty response body from source.');
    }

    logEvent('INFO', 'API_DOWNLOAD', 'Proxy Success', { ip, type, size: contentLength });

  } catch (err) {
    logEvent('ERROR', 'API_DOWNLOAD', 'Internal Error', { ip, error: err.message });
    return res.status(502).json({ code: 'DOWNLOAD_FAILED', msg: 'Failed to download media.' });
  }
}
