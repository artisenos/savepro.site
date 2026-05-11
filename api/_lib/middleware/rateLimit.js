import { Redis } from '@upstash/redis';
import config from '../config.js';

let client = null;

function getRedis() {
  if (client) return client;
  if (!config.upstash.url || !config.upstash.token) return null;
  client = new Redis({ url: config.upstash.url, token: config.upstash.token });
  return client;
}

export async function checkRateLimit(ip) {
  try {
    const redis = getRedis();
    if (!redis) return null;

    const key = `ratelimit:${ip}`;
    const count = await redis.incr(key);
    if (count === 1) await redis.expire(key, config.rateLimit.windowMs);

    if (count > config.rateLimit.max) {
      return { success: false, message: 'Too many requests. Please slow down.' };
    }
    return null;
  } catch {
    return null;
  }
}
