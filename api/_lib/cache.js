/**
 * Simple in-memory cache.
 * No external dependencies required.
 */
const memoryCache = new Map();

export async function getFromCache(key) {
  try {
    const entry = memoryCache.get(key);
    if (entry && entry.expiry > Date.now()) {
      return entry.data;
    }
    if (entry) memoryCache.delete(key);
    return null;
  } catch {
    return null;
  }
}

export async function setToCache(key, data, ttl = 3600) {
  try {
    memoryCache.set(key, {
      data,
      expiry: Date.now() + (ttl * 1000),
    });
  } catch {
    // Silently fail
  }
}
