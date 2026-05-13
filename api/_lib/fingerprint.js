// ============================================
// SavePro API - Enhanced Fingerprint Generator
// 2026 TikTok-compatible User-Agents + Spoofing
// ============================================

// Chrome 140+ User-Agents for 2026
const CHROME_USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.3482.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.3443.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.3389.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.3312.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.3278.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.3482.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.3443.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.3482.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.3443.0 Safari/537.36',
];

// iOS 19 User-Agents
const IOS_USER_AGENTS = [
  'Mozilla/5.0 (iPhone; CPU iPhone OS 19_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/140.0.3482.0 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 19_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/140.0.3443.0 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (iPad; CPU OS 19_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/140.0.3482.0 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 19_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/140.0.3482.0 Mobile/15E148 Safari/605.1',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 19_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/140.0.3443.0 Mobile/15E148 Safari/605.1',
];

// Android 15 User-Agents
const ANDROID_USER_AGENTS = [
  'Mozilla/5.0 (Linux; Android 15; Pixel 9 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.3482.0 Mobile Safari/537.36',
  'Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.3443.0 Mobile Safari/537.36',
  'Mozilla/5.0 (Linux; Android 15; Samsung Galaxy S25 Ultra) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.3482.0 Mobile Safari/537.36',
  'Mozilla/5.0 (Linux; Android 15; Samsung Galaxy S25) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.3443.0 Mobile Safari/537.36',
  'Mozilla/5.0 (Linux; Android 15; OnePlus 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.3482.0 Mobile Safari/537.36',
  'Mozilla/5.0 (Linux; Android 14; Pixel 8 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.3482.0 Mobile Safari/537.36',
  'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.3443.0 Mobile Safari/537.36',
];

// TikTok App User-Agents - iOS
const TIKTOK_IOS_UA = [
  'TikTok/36.0.3 (iPhone; CPU iPhone OS 18_2 like Mac OS X) Mobile/15E148 Safari/604.1',
  'TikTok/35.9.3 (iPhone; CPU iPhone OS 18_1 like Mac OS X) Mobile/15E148 Safari/604.1',
  'TikTok/35.8.2 (iPhone; CPU iPhone OS 18_0 like Mac OS X) Mobile/15E148 Safari/604.1',
  'TikTok/35.7.1 (iPhone; CPU iPhone OS 17_6 like Mac OS X) Mobile/15E148 Safari/604.1',
  'TikTok/35.6.1 (iPhone; CPU iPhone OS 17_5 like Mac OS X) Mobile/15E148 Safari/604.1',
  'TikTok/34.9.2 (iPhone; CPU iPhone OS 17_4 like Mac OS X) Mobile/15E148 Safari/604.1',
  'TikTok/34.8.1 (iPhone; CPU iPhone OS 17_3 like Mac OS X) Mobile/15E148 Safari/604.1',
];

// TikTok App User-Agents - Android
const TIKTOK_ANDROID_UA = [
  'TikTok/36.0.3 (Linux; U; Android 15; en_US; SM-S918B) Device/OnePlus/OP5955',
  'TikTok/36.0.3 (Linux; U; Android 15; en_US; Pixel 9 Pro) Device/Google/Pixel9Pro',
  'TikTok/35.9.3 (Linux; U; Android 14; en_US; SM-G998B) Device/Samsung/GalaxyS21',
  'TikTok/35.9.3 (Linux; U; Android 14; en_US; SM-A546B) Device/Samsung/GalaxyA54',
  'TikTok/35.9.3 (Linux; U; Android 14; en_US; Pixel 8) Device/Google/Pixel8',
  'TikTok/35.8.2 (Linux; U; Android 14; en_US; RMX3562) Device/Realme/RealmeGT',
  'TikTok/35.7.1 (Linux; U; Android 13; en_US; Mi 13) Device/Xiaomi/Mi13',
  'TikTok/34.9.2 (Linux; U; Android 13; en_US; SM-A136B) Device/Samsung/GalaxyA13',
];

// TikTok Web User-Agents
const TIKTOK_WEB_UA = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.3482.0 Safari/537.36 TikTok/1',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.3443.0 Safari/537.36 TikTok/1',
  'Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.3482.0 Safari/537.36 Mobile TikTok/1',
  'Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.3443.0 Safari/537.36 Mobile TikTok/1',
];

// TikTok Referers
const TIKTOK_REFERERS = [
  'https://www.tiktok.com/',
  'https://www.tiktok.com/feed',
  'https://www.tiktok.com/@tiktok',
  'https://www.tiktok.com/discover',
  'https://www.tiktok.com/foryou',
  'https://www.tiktok.com/trending',
  'https://www.tiktok.com/api/user/feed/',
  'https://www.tiktok.com/aweme/v1/web/aweme/v11/web/related/feed/',
  'https://www.tiktok.com/api/feed/item/list/',
];

// ============================================
// Main Export Functions
// ============================================

/**
 * Generate a random high-trust User-Agent (all types)
 * @returns {string} Random User-Agent string
 */
export function generateUserAgent() {
  const allAgents = [
    ...CHROME_USER_AGENTS,
    ...IOS_USER_AGENTS,
    ...ANDROID_USER_AGENTS,
    ...TIKTOK_IOS_UA,
    ...TIKTOK_ANDROID_UA,
    ...TIKTOK_WEB_UA,
  ];
  return allAgents[Math.floor(Math.random() * allAgents.length)];
}

/**
 * Generate User-Agent based on device type
 * @param {string} device - 'desktop', 'ios', 'android', 'tiktok-ios', 'tiktok-android'
 * @returns {string} Platform-specific User-Agent
 */
export function generateUserAgentFor(device = 'desktop') {
  let pool;
  
  switch (device.toLowerCase()) {
    case 'ios':
    case 'iphone':
      pool = IOS_USER_AGENTS;
      break;
    case 'tiktok-ios':
    case 'tiktok-iphone':
      pool = TIKTOK_IOS_UA;
      break;
    case 'android':
      pool = ANDROID_USER_AGENTS;
      break;
    case 'tiktok-android':
      pool = TIKTOK_ANDROID_UA;
      break;
    case 'tiktok-web':
      pool = TIKTOK_WEB_UA;
      break;
    case 'tiktok':
      pool = [...TIKTOK_IOS_UA, ...TIKTOK_ANDROID_UA, ...TIKTOK_WEB_UA];
      break;
    case 'desktop':
    default:
      pool = CHROME_USER_AGENTS;
  }
  
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Generate random TikTok referer
 * @returns {string} Random TikTok referer URL
 */
export function generateTikTokReferer() {
  return TIKTOK_REFERERS[Math.floor(Math.random() * TIKTOK_REFERERS.length)];
}

/**
 * Generate complete browser headers for TikTok
 * @param {Object} options - Options for header generation
 * @returns {Object} Complete headers for request
 */
export function generateTikTokHeaders(options = {}) {
  const {
    device = 'tiktok',
    includeReferer = true,
    includeOrigin = true,
  } = options;
  
  const ua = generateUserAgentFor(device);
  const isMobile = /Mobile|Android|iPhone|iPad/i.test(ua);
  
  const headers = {
    'User-Agent': ua,
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'en-US,en;q=0.9,ar;q=0.8',
    'Accept-Encoding': 'gzip, deflate, br',
    'DNT': '1',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-site',
  };
  
  if (includeReferer) {
    headers['Referer'] = generateTikTokReferer();
  }
  
  if (includeOrigin) {
    headers['Origin'] = 'https://www.tiktok.com';
  }
  
  // Chrome-specific headers
  if (!ua.includes('TikTok/')) {
    headers['Sec-Ch-Ua'] = '"Not-A.Brand";v="99", "Chromium";v="140"';
    headers['Sec-Ch-Ua-Mobile'] = isMobile ? '?1' : '?0';
    headers['Sec-Ch-Ua-Platform'] = isMobile ? '"Android"' : '"Windows"';
    headers['Sec-Ch-Ua-Platform-Version'] = isMobile ? '"15"' : '"14"';
  }
  
  return headers;
}

/**
 * Legacy function - maintained for compatibility
 * @param {string} userAgent - Optional custom User-Agent
 * @returns {Object} Complete headers for request
 */
export function generateBrowserHeaders(userAgent = null) {
  return generateTikTokHeaders({ device: userAgent ? 'desktop' : 'tiktok' });
}

/**
 * Get TLS fingerprint configuration
 * @returns {Object} TLS options for fetch
 */
export function getTLSConfig() {
  return {
    ciphers: 'ECDHE+AESGCM:ECDHE+CHACHA20:DHE+AESGCM:DHE+CHACHA20:!aNULL:!MD5:!DSS',
    minimumVersion: 'TLSv1.2',
    ecdhCurve: 'auto',
  };
}

/**
 * Detect if request is likely being blocked
 * @param {number} status - HTTP status code
 * @param {string} body - Response body
 * @returns {boolean} True if likely blocked
 */
export function isBlocked(status, body = '') {
  const blockIndicators = [
    status === 403,
    status === 429,
    status === 451,
    body.toLowerCase().includes('captcha'),
    body.toLowerCase().includes('blocked'),
    body.toLowerCase().includes('access denied'),
    body.toLowerCase().includes('forbidden'),
    body.toLowerCase().includes('too many requests'),
    body.toLowerCase().includes('please wait'),
  ];
  
  return blockIndicators.some(Boolean);
}

/**
 * Get random delay between requests (ms)
 * @param {number} min - Minimum ms
 * @param {number} max - Maximum ms
 * @returns {number} Random delay
 */
export function getRandomDelay(min = 100, max = 500) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate random IP address for spoofing
 * @returns {string} Random IP
 */
export function getRandomIP() {
  let first = Math.floor(Math.random() * 223) + 1;
  while ([0, 10, 127].includes(first) || first >= 224) {
    first = Math.floor(Math.random() * 223) + 1;
  }
  return `${first}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 254) + 1}`;
}