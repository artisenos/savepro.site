// ============================================
// SavePro API - Hybrid Proxy Manager (Enhanced)
// Hybrid Mode: Direct connection when no proxy available
// Enhanced Spoofing: Random IPs + TikTok headers
// ============================================

let proxyConfig = null;

/**
 * Initialize proxy configuration - Hybrid Mode
 * @returns {Object} Proxy configuration with mode info
 */
export function initProxy() {
  const proxyUrl = process.env.PROXY_URL;
  const proxyUser = process.env.PROXY_USER;
  const proxyPass = process.env.PROXY_PASS;

  if (!proxyUrl) {
    // HYBRID MODE: Use direct connection
    console.log('🔗 Proxy: No PROXY_URL configured. Using DIRECT CONNECTION (Hybrid Mode)');
    proxyConfig = {
      mode: 'direct',
      url: null,
      hasAuth: false,
    };
    return proxyConfig;
  }

  // Proxy mode with authentication
  let proxyFullUrl = proxyUrl;
  if (proxyUser && proxyPass) {
    try {
      const url = new URL(proxyUrl);
      url.username = proxyUser;
      url.password = proxyPass;
      proxyFullUrl = url.toString();
    } catch {
      proxyFullUrl = `http://${proxyUser}:${proxyPass}@${proxyUrl.replace(/^https?:\/\//, '')}`;
    }
  }

  proxyConfig = {
    mode: 'proxy',
    url: proxyUrl,
    fullUrl: proxyFullUrl,
    hasAuth: !!(proxyUser && proxyPass),
  };

  console.log('🔗 Proxy: Initialized in PROXY mode with', proxyUrl);
  return proxyConfig;
}

/**
 * Get current proxy mode
 * @returns {string} 'direct' or 'proxy'
 */
export function getProxyMode() {
  if (!proxyConfig) {
    initProxy();
  }
  return proxyConfig?.mode || 'direct';
}

/**
 * Generate random residential-like IP address
 * @returns {string} Random IP
 */
export function getRandomIP() {
  const isReserved = (n) => n === 0 || n === 10 || n === 127 || n >= 224;
  
  let first = Math.floor(Math.random() * 223) + 1;
  while (isReserved(first)) {
    first = Math.floor(Math.random() * 223) + 1;
  }
  
  return `${first}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 254) + 1}`;
}

/**
 * Generate random TikTok referer
 * @returns {string} Random TikTok referer URL
 */
function getRandomTikTokReferer() {
  const referers = [
    'https://www.tiktok.com/',
    'https://www.tiktok.com/feed',
    'https://www.tiktok.com/@tiktok',
    'https://www.tiktok.com/discover',
    'https://www.tiktok.com/foryou',
    'https://www.tiktok.com/trending',
    'https://www.tiktok.com/api/user/feed/',
    'https://www.tiktok.com/aweme/v1/web/aweme/v11/web/related/feed/',
  ];
  return referers[Math.floor(Math.random() * referers.length)];
}

/**
 * Build enhanced spoofed headers for TikTok
 * @param {Object} baseHeaders - Base headers to merge
 * @returns {Object} Enhanced headers with spoofing
 */
export function buildSpoofedHeaders(baseHeaders = {}) {
  const randomIP = getRandomIP();
  const randomIP2 = getRandomIP();
  const referer = getRandomTikTokReferer();
  
  // Import from fingerprint for User-Agent
  let userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.3482.0 Safari/537.36';
  
  // Try to use fingerprint module if available
  try {
    const { generateUserAgent } = require('./fingerprint.js');
    userAgent = generateUserAgent();
  } catch {
    // Fallback to default
  }

  const spoofed = {
    ...baseHeaders,
    // Spoofed IPs
    'X-Forwarded-For': randomIP,
    'X-Real-IP': randomIP2,
    'X-Client-IP': randomIP,
    'CF-Connecting-IP': randomIP,
    
    // TikTok-specific
    'User-Agent': userAgent,
    'Referer': referer,
    'Origin': 'https://www.tiktok.com',
    
    // Standard headers
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'en-US,en;q=0.9,ar;q=0.8',
    'Accept-Encoding': 'gzip, deflate, br',
    'DNT': '1',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
    
    // Security headers
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-site',
  };

return spoofed;
}

/**
 * Create fetch options with enhanced spoofing
 * @param {Object} options - Base fetch options
 * @returns {Object} Options with enhanced headers
 */
export function createProxyFetchOptions(options = {}) {
  const headers = buildSpoofedHeaders(options.headers || {});
  
  return {
    ...options,
    headers,
  };
}