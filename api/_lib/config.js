export default {
  upstash: {
    url: process.env.UPSTASH_REDIS_REST_URL || '',
    token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
  },

  rateLimit: {
    windowMs: 60,
    max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 30,
  },

  apiKeys: (process.env.API_KEYS || '').split(',').filter(Boolean),

  tikwm: {
    baseUrl: 'https://www.tikwm.com/api/',
    timeout: 7000,
  },

  cache: {
    ttl: parseInt(process.env.CACHE_TTL, 10) || 3600,
    videoTtl: parseInt(process.env.CACHE_VIDEO_TTL, 10) || 7200,
  },

  cors: {
    origin: process.env.CORS_ORIGIN || '*',
  },
};
