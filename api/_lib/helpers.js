// ============================================
// SavePro API - Helpers & Redis Cache
// Redis HTTP API integration + Security utilities
// ============================================

let redisClient = null;
let redisType = null;

/**
 * Scrub Redis credentials from logs
 */
function scrubRedisCredentials(message) {
  if (!message) return '';
  let sanitized = message;
  
  sanitized = sanitized.replace(/redis:\/\/[^@]*@/g, 'redis://***:***@');
  
  if (process.env.UPSTASH_REDIS_REST_TOKEN) {
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    if (token && token.length > 4) {
      const prefix = token.substring(0, 8);
      sanitized = sanitized.replace(new RegExp(prefix, 'g'), '********');
    }
  }
  
  return sanitized;
}

/**
 * Get Redis client (lazy initialization)
 */
export function getRedis() {
  if (redisClient) return redisClient;

  const redisUrl = process.env.REDIS_URL;
  
  if (redisUrl) {
    try {
      redisClient = createRedisHTTPClient(redisUrl);
      redisType = 'redis';
      console.log('🔵 Redis: Connected via REDIS_URL');
      return redisClient;
    } catch (error) {
      console.error('🔴 Redis: REDIS_URL connection failed', scrubRedisCredentials(error.message));
    }
  }

  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (upstashUrl && upstashToken) {
    try {
      redisClient = createUpstashClient(upstashUrl, upstashToken);
      redisType = 'upstash';
      console.log('🟢 Redis: Connected to Upstash');
      return redisClient;
    } catch (error) {
      console.error('🔴 Redis: Upstash connection failed', scrubRedisCredentials(error.message));
    }
  }

  console.log('🟡 Redis: Using in-memory fallback');
  redisClient = createMemoryCache();
  redisType = 'memory';
  return redisClient;
}

/**
 * Create Redis HTTP API client
 */
function createRedisHTTPClient(redisUrl) {
  const parsed = new URL(redisUrl);
  const baseUrl = `${parsed.protocol}//${parsed.host}`;
  const auth = btoa(parsed.username + ':' + parsed.password);

  return {
    _type: 'redis',
    _baseUrl: baseUrl,

    async get(key) {
      try {
        const response = await fetch(`${baseUrl}/get/${key}`, {
          headers: { Authorization: `Basic ${auth}` }
        });
        const data = await response.json();
        return data.result || null;
      } catch {
        return null;
      }
    },

    async set(key, value, options = {}) {
      try {
        const body = options.ex 
          ? JSON.stringify({ value, ex: options.ex })
          : JSON.stringify({ value });
        
        await fetch(`${baseUrl}/set/${key}`, {
          method: 'POST',
          headers: {
            Authorization: `Basic ${auth}`,
            'Content-Type': 'application/json'
          },
          body
        });
        return true;
      } catch {
        return false;
      }
    },

    async del(key) {
      try {
        await fetch(`${baseUrl}/del/${key}`, {
          method: 'POST',
          headers: { Authorization: `Basic ${auth}` }
        });
        return true;
      } catch {
        return false;
      }
    },

    async incr(key) {
      try {
        const response = await fetch(`${baseUrl}/incr/${key}`, {
          method: 'POST',
          headers: { Authorization: `Basic ${auth}` }
        });
        const data = await response.json();
        return data.result || 0;
      } catch {
        return 0;
      }
    }
  };
}

/**
 * Create Upstash Redis client
 */
function createUpstashClient(url, token) {
  const baseUrl = url.replace(/\/$/, '');

  return {
    _type: 'upstash',

    async get(key) {
      try {
        const response = await fetch(`${baseUrl}/get/${key}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        return data.result || null;
      } catch {
        return null;
      }
    },

    async set(key, value, options = {}) {
      try {
        const body = options.ex 
          ? JSON.stringify({ value, ex: options.ex })
          : JSON.stringify({ value });
        
        await fetch(`${baseUrl}/set/${key}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body
        });
        return true;
      } catch {
        return false;
      }
    },

    async del(key) {
      try {
        await fetch(`${baseUrl}/del/${key}`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        });
        return true;
      } catch {
        return false;
      }
    },

    async incr(key) {
      try {
        const response = await fetch(`${baseUrl}/incr/${key}`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        return data.result || 0;
      } catch {
        return 0;
      }
    }
  };
}

/**
 * Create in-memory cache fallback
 */
function createMemoryCache() {
  const cache = new Map();
  const timestamps = new Map();

  return {
    _type: 'memory',

    async get(key) {
      const ttl = timestamps.get(key);
      if (ttl && Date.now() > ttl) {
        cache.delete(key);
        timestamps.delete(key);
        return null;
      }
      return cache.get(key) || null;
    },

    async set(key, value, options = {}) {
      cache.set(key, value);
      if (options.ex) {
        timestamps.set(key, Date.now() + options.ex * 1000);
      }
      return true;
    },

    async del(key) {
      cache.delete(key);
      timestamps.delete(key);
      return true;
    },

    async incr(key) {
      const current = cache.get(key) || 0;
      const next = current + 1;
      cache.set(key, next);
      return next;
    }
  };
}

/**
 * Simple hash function
 */
export function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

/**
 * Get cache key
 */
export function getCacheKey(prefix, url) {
  return `${prefix}:${simpleHash(url)}`;
}

/**
 * Rate limiter using Redis
 */
export async function checkRateLimit(key, limit = 100, window = 60) {
  const redis = getRedis();
  const windowKey = `ratelimit:${key}`;
  
  try {
    const current = await redis.incr(windowKey);
    
    return {
      allowed: current <= limit,
      remaining: Math.max(0, limit - current),
      reset: window,
      current,
    };
  } catch {
    return { allowed: true, remaining: limit, reset: window, current: 0 };
  }
}

/**
 * Get security headers
 */
export function getSecurityHeaders() {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  };
}

/**
 * Validate TikTok URL
 */
export function isValidTikTokUrl(url) {
  if (!url || typeof url !== 'string') return false;
  
  const patterns = [
    /tiktok\.com\/@[\w.]+\/video\/\d+/i,
    /tiktok\.com\/v\/\d+/i,
    /tiktok\.com\/@[\w.]+/i,
    /vm\.tiktok\.com\/\w+/i,
  ];
  
  return patterns.some(pattern => pattern.test(url));
}

/**
 * Get client IP from request
 */
export function getClientIP(req) {
  const headers = req.headers;
  
  return headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
         headers.get('x-real-ip') ||
         headers.get('cf-connecting-ip') ||
         'unknown';
}

/**
 * Get video from cache
 */
export async function getVideoFromCache(url) {
  const redis = getRedis();
  const cacheKey = `video:${simpleHash(url)}`;
  
  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log(`[Cache] HIT for ${url.substring(0, 40)}...`);
      return typeof cached === 'string' ? JSON.parse(cached) : cached;
    }
  } catch (error) {
    console.log(`[Cache] Error: ${error.message}`);
  }
  
  console.log(`[Cache] MISS for ${url.substring(0, 40)}...`);
  return null;
}

/**
 * Save video to cache (24 hours default)
 */
export async function saveVideoToCache(url, data, ttl = 86400) {
  const redis = getRedis();
  const cacheKey = `video:${simpleHash(url)}`;
  
  try {
    await redis.set(cacheKey, JSON.stringify(data), { ex: ttl });
    console.log(`[Cache] Saved for 24h: ${url.substring(0, 40)}...`);
    return true;
  } catch (error) {
    console.log(`[Cache] Save error: ${error.message}`);
    return false;
  }
}

/**
 * Get cache status
 */
export function getCacheStatus() {
  return {
    type: redisType,
    connected: redisType !== 'memory',
    timestamp: Date.now(),
  };
}