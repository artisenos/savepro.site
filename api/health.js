// ============================================
// SavePro API - Health Check Endpoint
// System status monitoring for production
// ============================================

export const config = {
  runtime: 'edge',
  regions: ['iad1', 'sfo1', 'fra1'],
};

const VERSION = '1.0.0';

export default async function handler(req) {
  const startTime = Date.now();
  const requestId = crypto.randomUUID().slice(0, 8);

  if (req.method !== 'GET') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  try {
    const { getRedis, getCacheStatus } = await import('./_lib/helpers.js');
    const redis = getRedis();
    const cacheStatus = getCacheStatus();
    
    const { getAuthStatus } = await import('./_lib/auth.js');
    const authStatus = getAuthStatus();

    const health = {
      status: 'ok',
      version: VERSION,
      requestId,
      timestamp: Date.now(),
      services: {
        redis: {
          status: cacheStatus.type !== 'memory' ? 'connected' : 'fallback',
          type: cacheStatus.type,
        },
        auth: {
          status: authStatus.internalEnv ? 'enabled' : 'disabled',
          mode: authStatus.mode,
        },
        oidc: {
          issuer: authStatus.issuer,
          audience: authStatus.audience,
        }
      },
      environment: {
        node: 'edge',
        platform: 'vercel',
        region: req.headers.get('x-vercel-id')?.split(':')[0] || 'unknown',
      },
      responseTime: Date.now() - startTime,
    };

    console.log(`[${requestId}] Health check: ${health.status} (${health.responseTime}ms)`);

    return jsonResponse(health, 200);

  } catch (error) {
    console.error(`[${requestId}] Health check failed: ${error.message}`);

    return jsonResponse({
      status: 'error',
      version: VERSION,
      requestId,
      timestamp: Date.now(),
      error: 'Health check failed',
    }, 503);
  }
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Access-Control-Allow-Origin': '*',
    },
  });
}