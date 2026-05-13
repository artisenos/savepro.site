// ============================================
// SavePro API - Rate Limiting Middleware
// Optimized with flag-based cache detection
// ============================================

import { checkRateLimit, getClientIP, simpleHash } from './helpers.js';

const DEFAULT_LIMITS = {
  ip: { requests: 100, window: 60 },
  apiKey: { requests: 500, window: 60 },
  video: { requests: 10, window: 3600 },
};

const rateLimitStore = new Map();

export async function checkRequestRateLimit(req, options = {}) {
  const config = { ...DEFAULT_LIMITS, ...options };
  const clientIP = getClientIP(req);
  const apiKey = req.headers.get('x-api-key') || 
                 new URL(req.url).searchParams.get('key');
  const videoUrl = new URL(req.url).searchParams.get('url');

  const ipLimit = await checkWithStore(`ip:${clientIP}`, config.ip.requests, config.ip.window);
  if (!ipLimit.allowed) {
    return createResponse('Rate limit exceeded for your IP', ipLimit.remaining, ipLimit.reset, 'IP');
  }

  if (apiKey) {
    const keyLimit = await checkWithStore(`key:${apiKey}`, config.apiKey.requests, config.apiKey.window);
    if (!keyLimit.allowed) {
      return createResponse('Rate limit exceeded for your API key', keyLimit.remaining, keyLimit.reset, 'API_KEY');
    }
  }

  if (videoUrl) {
    const videoHash = simpleHash(videoUrl.substring(0, 50));
    const videoLimit = await checkWithStore(`video:${videoHash}`, config.video.requests, config.video.window);
    if (!videoLimit.allowed) {
      return createResponse('Too many requests for this video', videoLimit.remaining, videoLimit.reset, 'VIDEO');
    }
  }

  return { allowed: true };
}

async function checkWithStore(key, limit, window) {
  const { getRedis } = await import('./helpers.js');
  const redis = getRedis();
  
  if (redis && redis._type !== 'memory') {
    try {
      const current = await redis.incr(`ratelimit:${key}`);
      return {
        allowed: current <= limit,
        remaining: Math.max(0, limit - current),
        current,
      };
    } catch {
      // Fall through to memory
    }
  }

  const now = Date.now();
  const windowMs = window * 1000;
  let entry = rateLimitStore.get(key);
  
  if (!entry || now - entry.start > windowMs) {
    entry = { start: now, count: 1 };
    rateLimitStore.set(key, entry);
    return { allowed: true, remaining: limit - 1, current: 1 };
  }
  
  entry.count++;
  rateLimitStore.set(key, entry);
  
  return {
    allowed: entry.count <= limit,
    remaining: Math.max(0, limit - entry.count),
    current: entry.count,
  };
}

function createResponse(message, remaining, reset, type) {
  const response = new Response(JSON.stringify({
    success: false,
    error: message,
    rateLimit: { type, remaining: Math.max(0, remaining), resetIn: reset, retryAfter: reset },
  }), {
    status: 429,
    headers: {
      'Content-Type': 'application/json',
      'Retry-After': reset.toString(),
      'X-RateLimit-Remaining': Math.max(0, remaining).toString(),
      'X-RateLimit-Reset': reset.toString(),
    },
  });
  
  return { allowed: false, remaining: Math.max(0, remaining), reset, response };
}

export default checkRequestRateLimit;