# SavePro - TikTok Video Downloader API

**Production-Ready SaaS Platform** | Powered by Vercel Edge Runtime, OIDC Zero Trust, and Redis HTTP API

---

## Overview

SavePro is a high-performance TikTok video downloader with no watermark extraction, built on a serverless edge architecture. It provides a clean REST API for downloading videos and audio, with enterprise-grade security, intelligent caching, and multi-region deployment.

**Live:** [https://savepro.site](https://savepro.site)

---

## Architecture

| Layer | Technology |
|---|---|
| Runtime | Vercel Edge Runtime (Node.js) |
| Authentication | OIDC + JWT (Vercel + `jose`) |
| Caching | Redis HTTP API (direct fetch) |
| API | REST over Edge Functions |
| Frontend | Static SPA (HTML/CSS/JS) |

---

## API Endpoints

### `GET /api/health`
Health check endpoint for monitoring.

```json
{
  "status": "ok",
  "version": "1.0.0",
  "services": {
    "redis": { "status": "connected", "type": "redis" },
    "auth": { "status": "enabled", "mode": "production" },
    "oidc": { "issuer": "https://oidc.vercel.com" }
  },
  "environment": { "node": "edge", "platform": "vercel" },
  "responseTime": 12
}
```

### `GET /api/video?url=<tiktok_url>`
Download a TikTok video or audio.

**Query Parameters:**
- `url` (required) - TikTok video URL
- `format` (optional) - `video` or `mp3` (default: `video`)
- `key` (optional) - API key for higher rate limits

**Response:**
```json
{
  "success": true,
  "video": {
    "url": "https://...",
    "title": "...",
    "duration": 60,
    "thumbnail": "https://..."
  }
}
```

---

## Security

### Zero Trust Architecture

Every API request is verified against Vercel's OIDC provider:

- **Issuer:** `https://oidc.vercel.com`
- **Audience:** `https://vercel.com/dzwiliampw-5524s-projects`
- **Token Validation:** Full JWT verification with `jose` library

### Internal Environment Verification

Production requests must originate from Vercel's internal environment with a valid `VERCEL_OIDC_TOKEN`. External requests without a Bearer token receive public (limited) rate limits.

### Credential Scrubbing

All logs automatically scrub sensitive data before output:
- Passwords, API keys, Bearer tokens
- JWT tokens, OIDC tokens
- Redis connection strings

---

## Rate Limiting

| Tier | Requests | Window | Condition |
|---|---|---|---|
| Public | 10 | 60s | No auth token |
| Authenticated | 500 | 60s | Valid JWT |
| Developer | 10,000 | 60s | Dev environment |

---

## Redis HTTP API

SavePro connects directly to Redis via HTTP API (fetch) for maximum edge compatibility. No SDK dependencies.

**Environment Variables:**
```env
REDIS_URL=redis://default:password@host:port
```

The client automatically handles:
- `GET` - Cache retrieval
- `SET` - Cache storage with TTL
- `INCR` - Rate limit counters
- `DEL` - Cache invalidation

---

## Environment Variables

### Required (Production)

| Variable | Description |
|---|---|
| `REDIS_URL` | Redis HTTP API connection string |
| `VERCEL_OIDC_TOKEN` | Vercel internal OIDC token (auto-injected) |

### Optional

| Variable | Description |
|---|---|
| `PROXY_URL` | Proxy server URL |
| `PROXY_USER` | Proxy username |
| `PROXY_PASS` | Proxy password |

---

## Deployment

SavePro deploys automatically to Vercel via Git.

1. Push to GitHub
2. Import in [Vercel Dashboard](https://vercel.com/dzwiliampw-5524s-projects)
3. Configure environment variables
4. Deploy

No build step required — pure Edge Runtime JavaScript.

---

## Project Structure

```
savepro.site/
├── api/
│   ├── _lib/
│   │   ├── auth.js         # OIDC + JWT verification
│   │   ├── helpers.js      # Redis HTTP client + utils
│   │   ├── proxy.js        # Hybrid proxy manager
│   │   ├── fingerprint.js  # User-Agent spoofing
│   │   └── rateLimit.js    # Rate limiting middleware
│   ├── health.js           # Health check endpoint
│   └── package.json        # (jose only)
├── public/                 # Static assets + favicons
├── index.html              # Frontend SPA
└── package.json            # Frontend dependencies
```

---

## Development

```bash
# Install dependencies
npm install

# Local dev (no edge runtime)
# Set dev token for testing:
VERCEL_ENV=preview node api/index.js

# Build frontend
npm run build
```

---

## Features

- Download TikTok videos without watermark
- Extract MP3 audio
- Multi-language UI (10 languages)
- Dark/Light theme
- Responsive design (RTL/Arabic supported)
- Edge-optimized (< 50ms cold start)
- Redis caching (24h TTL)
- Smart rate limiting per IP/API key/Video
- Advanced spoofing (IP rotation, User-Agent rotation)

---

## License

Educational and personal use only. Respect TikTok's Terms of Service and content creators' copyrights. Not affiliated with TikTok or ByteDance.