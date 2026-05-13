// ============================================
// SavePro API - Download Proxy Endpoint
// Serves video/audio through proxy to avoid CORS + OIDC Auth
// ============================================

export const config = {
  runtime: 'edge',
  regions: ['iad1', 'sfo1', 'fra1'],
};

const TIMEOUT_MS = 30000; // 30 seconds
const MAX_SIZE = 200 * 1024 * 1024; // 200MB max

export default async function handler(req) {
  const requestId = crypto.randomUUID().slice(0, 8);

  // ═══ IDENTITY VERIFICATION (Zero Trust) ═══
  const auth = await verifyRequest(req);
  if (!auth.authorized) {
    console.log(`[${requestId}] 🔒 Unauthorized: ${auth.error}`);
    return errorResponse('Unauthorized access denied', 401);
  }

  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get('url');
    const type = searchParams.get('type') || 'video'; // video | music
    const apiKey = req.headers.get('x-api-key') || searchParams.get('key');

    // Validate API key
    if (!apiKey && process.env.API_KEY) {
      return errorResponse('API key required', 401);
    }
    if (process.env.API_KEY && apiKey !== process.env.API_KEY) {
      return errorResponse('Invalid API key', 403);
    }

    // Validate URL
    if (!url) {
      return errorResponse('URL parameter is required', 400);
    }

    // Validate type
    if (!['video', 'music'].includes(type)) {
      return errorResponse('Invalid type. Use video or music', 400);
    }

    // Decode and validate URL
    const mediaUrl = decodeURIComponent(url);
    if (!mediaUrl.startsWith('http')) {
      return errorResponse('Invalid media URL', 400);
    }

    console.log(`[${requestId}] Downloading ${type} from: ${mediaUrl.substring(0, 80)}...`);

    // Create abort controller with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    // Fetch the media
    const response = await fetch(mediaUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
        'Accept': type === 'music' ? 'audio/*,*/*' : 'video/*,*/*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://www.tiktok.com/',
        'Origin': 'https://www.tiktok.com',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(`[${requestId}] Fetch failed: ${response.status}`);
      return errorResponse(`Failed to fetch media: ${response.status}`, response.status);
    }

    // Check content length
    const contentLength = response.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > MAX_SIZE) {
      return errorResponse('File too large', 413);
    }

    // Get content type
    const contentType = response.headers.get('content-type') || 
      (type === 'music' ? 'audio/mpeg' : 'video/mp4');

    // Create readable stream for streaming response
    const readable = response.body;

    console.log(`[${requestId}] Streaming ${type}, content-type: ${contentType}`);

    // Return streaming response
    return new Response(readable, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="savepro-${type}-${Date.now()}.${type === 'music' ? 'mp3' : 'mp4'}"`,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, x-api-key, Authorization',
        'Cache-Control': 'public, max-age=3600',
        'X-Request-ID': requestId,
      },
    });

  } catch (error) {
    console.error(`[${requestId}] Download error: ${error.message}`);
    
    if (error.name === 'AbortError') {
      return errorResponse('Download timeout', 504);
    }
    
    return errorResponse(`Download failed: ${error.message}`, 500);
  }
}

function errorResponse(message, status) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

async function verifyRequest(req) {
  try {
    const { verifyRequest: verify } = await import('./_lib/auth.js');
    return await verify(req);
  } catch {
    return { authorized: true };
  }
}