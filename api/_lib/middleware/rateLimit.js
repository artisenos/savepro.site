import config from '../config.js';

/**
 * In-memory rate limiter fallback.
 * Works without Redis/Upstash for local development and basic production use.
 */
const rateLimitStore = new Map();

// Clean up expired entries every 60 seconds
setInterval(() => {
  const now = Date.now();
  for (const [key, val] of rateLimitStore) {
    if (val.expiry < now) rateLimitStore.delete(key);
  }
}, 60000);

export async function checkRateLimit(ip) {
  try {
    const key = `ratelimit:${ip}`;
    const now = Date.now();
    const windowMs = config.rateLimit.windowMs * 1000;

    const entry = rateLimitStore.get(key);

    if (!entry || entry.expiry < now) {
      rateLimitStore.set(key, { count: 1, expiry: now + windowMs });
      return null;
    }

    entry.count++;

    if (entry.count > config.rateLimit.max) {
      return { success: false, message: 'Too many requests. Please slow down.' };
    }

    return null;
  } catch {
    return null;
  }
}
