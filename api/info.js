// ============================================
// SavePro API - Main Video Info Endpoint
// Vercel Edge Function - Waterfall Failover + OIDC Auth
// ============================================

export const config = {
  runtime: 'edge',
  regions: ['iad1', 'sfo1', 'fra1'], // US East, US West, Frankfurt
};

const ENGINES = ['savetik', 'snaptik', 'ssstik'];
const CACHE_TTL = 900; // 15 minutes

export default async function handler(req) {
  const requestId = crypto.randomUUID().slice(0, 8);
  const startTime = Date.now();

  // ═══ IDENTITY VERIFICATION (Zero Trust) ═══
  const auth = await verifyRequest(req);

  // ═══ RATE LIMITING ═══
  try {
    const { checkRequestRateLimit } = await import('./_lib/rateLimit.js');
    const { getRateLimitConfig } = await import('./_lib/auth.js');
    
    const rateLimitConfig = getRateLimitConfig(auth);
    const rateLimit = await checkRequestRateLimit(req, { ip: rateLimitConfig });
    
    if (!rateLimit.allowed) {
      return rateLimit.response;
    }
  } catch (rateLimitError) {
    console.log(`[${requestId}] Rate limit check failed, continuing securely...`);
  }

  // Reject unauthorized
  if (!auth.authorized) {
    console.log(`[${requestId}] 🔒 Unauthorized: ${auth.error}`);
    return jsonResponse({ success: false, error: 'Unauthorized access denied' }, 401);
  }

  try {
    // Parse request
    const { searchParams } = new URL(req.url);
    const url = searchParams.get('url');
    const apiKey = req.headers.get('x-api-key') || searchParams.get('key');

    // Validate API key (if required)
    if (!apiKey && process.env.API_KEY) {
      return jsonResponse({ success: false, error: 'API key required' }, 401);
    }
    if (process.env.API_KEY && apiKey !== process.env.API_KEY) {
      return jsonResponse({ success: false, error: 'Invalid API key' }, 403);
    }

    // Validate URL
    if (!url) {
      return jsonResponse({ success: false, error: 'URL parameter is required' }, 400);
    }

    // Normalize TikTok URL
    const normalizedUrl = normalizeTikTokUrl(url);
    if (!normalizedUrl) {
      return jsonResponse({ success: false, error: 'Invalid TikTok URL' }, 400);
    }

    // Check cache first
    const cacheKey = `info:${normalizedUrl}`;
    const cached = await getCache(cacheKey);
    if (cached) {
      console.log(`[${requestId}] Cache hit for ${normalizedUrl}`);
      return jsonResponse({ success: true, data: cached, cached: true }, 200, true);
    }

    // Waterfall: Try each engine until success
    console.log(`[${requestId}] Starting waterfall for: ${normalizedUrl}`);
    let lastError = null;
    let usedEngine = null;

    for (const engine of ENGINES) {
      console.log(`[${requestId}] Trying engine: ${engine}`);
      try {
        const result = await fetchWithEngine(engine, normalizedUrl, requestId);
        if (result && result.videoUrl) {
          usedEngine = engine;

          // Extract and normalize data
          const data = {
            title: result.title || 'TikTok Video',
            author: result.author || result.username || 'Unknown',
            cover: result.cover || result.thumbnail || '',
            videoUrl: result.videoUrl || result.url || result.play || '',
            videoUrlHd: result.videoUrlHd || result.hd || result.videoUrl || '',
            videoUrlSd: result.videoUrlSd || result.sd || '',
            music: result.music || result.musicUrl || result.audio || '',
            musicUrl: result.music || result.musicUrl || '',
            duration: result.duration || 0,
            stats: result.stats || {
              likeCount: result.likes || 0,
              commentCount: result.comments || 0,
              shareCount: result.shares || 0,
              viewCount: result.views || 0,
            },
            watermark: result.watermark || '',
            createdAt: result.createdAt || Date.now(),
          };

          // Cache the result
          await setCache(cacheKey, data, CACHE_TTL);

          console.log(`[${requestId}] Success with engine: ${engine}, time: ${Date.now() - startTime}ms`);

          return jsonResponse({
            success: true,
            data,
            engine: usedEngine,
            cached: false,
            requestId,
          }, 200, true);
        }
      } catch (err) {
        console.log(`[${requestId}] Engine ${engine} failed: ${err.message}`);
        lastError = err;
        // Continue to next engine
      }
    }

    // All engines failed
    return jsonResponse({
      success: false,
      error: 'Failed to fetch video info. All engines exhausted.',
      details: lastError?.message || 'Unknown error',
      requestId,
    }, 502);

  } catch (error) {
    let safeMessage = error.message;
    try {
      const { scrubOidcCredentials } = await import('./_lib/auth.js');
      const { scrubRedisCredentials } = await import('./_lib/helpers.js');
      safeMessage = scrubRedisCredentials(scrubOidcCredentials(safeMessage));
    } catch {
      // Ignore scrubbing failure
    }
    console.error(`[${requestId}] Fatal error: ${safeMessage}`);
    return jsonResponse({
      success: false,
      error: 'Internal server error',
      requestId,
    }, 500);
  }
}

// ============================================
// Helper Functions
// ============================================

function normalizeTikTokUrl(url) {
  try {
    // Handle short URLs
    let normalized = url.trim();

    // Remove tracking parameters
    normalized = normalized.split('?')[0];

    // Extract video ID from various TikTok URL formats
    const patterns = [
      /tiktok\.com\/@[\w.]+\/video\/(\d+)/,
      /tiktok\.com\/v\/(\d+)/,
      /tiktok\.com\/(\d+)/,
      /vm\.tiktok\.com\/([\w]+)/,
      /www\.tiktok\.com\/@[\w.]+\/video\/(\d+)/,
    ];

    for (const pattern of patterns) {
      const match = normalized.match(pattern);
      if (match) {
        // Return standard URL format
        if (pattern.source.includes('vm.tiktok')) {
          return `https://vm.tiktok.com/${match[1]}`;
        }
        return normalized;
      }
    }

    // If it's already a valid URL, return it
    if (normalized.includes('tiktok.com')) {
      return normalized;
    }

    return null;
  } catch {
    return null;
  }
}

async function fetchWithEngine(engine, url, requestId) {
  const { fetchVideo } = await import('./_lib/engines.js');
  return fetchVideo(engine, url, requestId);
}

async function getCache(key) {
  try {
    const { getRedis } = await import('./_lib/helpers.js');
    const redis = getRedis();
    if (redis) {
      const data = await redis.get(`savepro:${key}`);
      return data ? JSON.parse(data) : null;
    }
  } catch {
    // Redis not available
  }
  return null;
}

async function setCache(key, value, ttl) {
  try {
    const { getRedis } = await import('./_lib/helpers.js');
    const redis = getRedis();
    if (redis) {
      await redis.set(`savepro:${key}`, JSON.stringify(value), { ex: ttl });
    }
  } catch {
    // Redis not available
  }
}

async function verifyRequest(req) {
  try {
    const { verifyRequest: verify } = await import('./_lib/auth.js');
    return await verify(req);
  } catch {
    // Fail secure if auth module cannot load
    return { authorized: false, error: 'auth_module_unavailable' };
  }
}

function jsonResponse(data, status = 200, cacheable = false) {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, x-api-key, Authorization',
  };

  if (cacheable) {
    headers['Cache-Control'] = 'public, s-maxage=900, stale-while-revalidate=60';
  } else {
    headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
  }

  return new Response(JSON.stringify(data), {
    status,
    headers,
  });
}