import { Redis } from '@upstash/redis';
import config from './config.js';

let client = null;

function getCache() {
  if (client) return client;
  if (!config.upstash.url || !config.upstash.token) return null;
  client = new Redis({ url: config.upstash.url, token: config.upstash.token });
  return client;
}

export async function getFromCache(key) {
  try {
    const redis = getCache();
    if (!redis) return null;
    const val = await redis.get(key);
    return val ? JSON.parse(val) : null;
  } catch {
    return null;
  }
}

export async function setToCache(key, data, ttl = config.cache.ttl) {
  try {
    const redis = getCache();
    if (!redis) return;
    await redis.setex(key, ttl, JSON.stringify(data));
  } catch {
  }
}
