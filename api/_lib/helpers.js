const TIKTOK_PATTERNS = [
  /https?:\/\/(?:www\.)?tiktok\.com\/@[\w.-]+\/video\/(\d+)/,
  /https?:\/\/(?:www\.)?tiktok\.com\/t\/([\w-]+)/,
  /https?:\/\/vm\.tiktok\.com\/([\w-]+)/,
  /https?:\/\/vt\.tiktok\.com\/([\w-]+)/,
  /https?:\/\/m\.tiktok\.com\/v\/(\d+)/,
];

export function isValidTikTokUrl(url) {
  if (!url || typeof url !== 'string') return false;
  return TIKTOK_PATTERNS.some((re) => re.test(url.trim()));
}

export function sanitizeInput(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[<>"'&]/g, '').trim();
}

export function forceHttps(link) {
  if (!link) return '';
  return link.replace(/^http:\/\//i, 'https://');
}

export function buildMeta(data) {
  return {
    success: true,
    title: data.title || 'TikTok Video',
    author: data.author?.nickname || data.author || 'TikTok User',
    cover: forceHttps(data.cover),
    videoUrlHd: forceHttps(data.hdplay || data.hdplay_url || data.play || ''),
    videoUrlSd: forceHttps(data.play || data.wmplay || data.play_url || ''),
    musicUrl: forceHttps(data.music || data.music_url || ''),
    duration: data.duration || 0,
    stats: {
      likes: data.digg_count || data.like_count || 0,
      comments: data.comment_count || 0,
      shares: data.share_count || 0,
      views: data.play_count || data.view_count || 0,
    },
  };
}

export function timeoutSignal(ms) {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), ms);
  return { signal: ctrl.signal, clear: () => clearTimeout(id) };
}

export function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Api-Key');
}

export function setSecurityHeaders(res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'no-referrer');
}
