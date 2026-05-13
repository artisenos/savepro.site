// ============================================
// SavePro API - Waterfall Download Engines with Cache-First
// Tries: Cache → Savetik → Snaptik → SSSTik
// Smart Retry on 403 with header changes
// ============================================

import { getRandomIP, generateUserAgentFor, generateTikTokReferer, isBlocked } from './fingerprint.js';
import { buildSpoofedHeaders } from './proxy.js';
import { getVideoFromCache, saveVideoToCache } from './helpers.js';

const ENGINE_CONFIGS = {
  savetik: {
    name: 'Savetik',
    timeout: 10000,
    maxRetries: 3,
  },
  snaptik: {
    name: 'Snaptik',
    timeout: 10000,
    maxRetries: 3,
  },
  ssstik: {
    name: 'SSSTik',
    timeout: 10000,
    maxRetries: 3,
  },
};

const DEFAULT_TIMEOUT = 15000;
const CACHE_TTL = 86400; // 24 hours in seconds

/**
 * Main function: Fetch video with cache-first strategy
 * @param {string} engine - Engine name
 * @param {string} url - TikTok URL
 * @param {string} requestId - Request ID for logging
 * @returns {Object} Video data
 */
export async function fetchVideo(engine, url, requestId) {
  const config = ENGINE_CONFIGS[engine];
  if (!config) {
    throw new Error(`Unknown engine: ${engine}`);
  }

  console.log(`[${requestId}] Engine ${config.name}: Starting fetch for ${url}`);

  // Create abort controller with timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);

  try {
    let result = null;

    // Try each engine with retry logic
    switch (engine) {
      case 'savetik':
        result = await fetchWithRetry('savetik', url, controller.signal, requestId);
        break;
      case 'snaptik':
        result = await fetchWithRetry('snaptik', url, controller.signal, requestId);
        break;
      case 'ssstik':
        result = await fetchWithRetry('ssstik', url, controller.signal, requestId);
        break;
    }

    clearTimeout(timeoutId);

    if (result && result.videoUrl) {
      console.log(`[${requestId}] Engine ${config.name}: SUCCESS`);
      
      // Save to cache for 24 hours
      try {
        await saveVideoToCache(url, result, CACHE_TTL);
        console.log(`[${requestId}] Saved to cache for 24 hours`);
      } catch (e) {
        // Cache save failed, continue anyway
      }
      
      return result;
    }

    throw new Error('No video URL extracted');
  } catch (error) {
    clearTimeout(timeoutId);
    console.log(`[${requestId}] Engine ${config.name}: FAILED - ${error.message}`);
    throw error;
  }
}

/**
 * Fetch with smart retry on 403 errors
 * @param {string} engine - Engine name
 * @param {string} url - TikTok URL
 * @param {Signal} signal - Abort signal
 * @param {string} requestId - Request ID
 * @returns {Object} Video data
 */
async function fetchWithRetry(engine, url, signal, requestId) {
  const config = ENGINE_CONFIGS[engine];
  let lastError = null;
  
  // Try up to maxRetries times
  for (let attempt = 0; attempt < config.maxRetries; attempt++) {
    try {
      console.log(`[${requestId}] ${config.name} attempt ${attempt + 1}/${config.maxRetries}`);
      
      // Generate fresh headers for each attempt
      const headers = generateAttemptHeaders(attempt);
      
      let result = null;
      
      switch (engine) {
        case 'savetik':
          result = await fetchSavetik(url, signal, requestId, headers);
          break;
        case 'snaptik':
          result = await fetchSnaptik(url, signal, requestId, headers);
          break;
        case 'ssstik':
          result = await fetchSSSTik(url, signal, requestId, headers);
          break;
      }
      
      if (result && result.videoUrl) {
        return result;
      }
      
      lastError = new Error('No video URL in response');
    } catch (error) {
      console.log(`[${requestId}] ${config.name} attempt ${attempt + 1} failed: ${error.message}`);
      lastError = error;
      
      // Check if we should retry
      const shouldRetry = shouldRetryOnError(error, attempt, config.maxRetries);
      
      if (shouldRetry.retry) {
        const delay = 1000 * (attempt + 1); // Increasing delay
        console.log(`[${requestId}] Retrying in ${delay}ms with new headers...`);
        await sleep(delay);
        continue; // Try again with new headers
      }
      
      // Don't retry, throw immediately
      throw error;
    }
  }
  
  throw lastError || new Error('All retries exhausted');
}

/**
 * Determine if we should retry on error
 * @param {Error} error - Error object
 * @param {number} attempt - Current attempt number
 * @param {number} maxRetries - Maximum retries
 * @returns {Object} { retry: boolean, reason: string }
 */
function shouldRetryOnError(error, attempt, maxRetries) {
  if (attempt >= maxRetries - 1) {
    return { retry: false, reason: 'max_retries_exceeded' };
  }
  
  const errorStr = error.message.toLowerCase();
  
  // Retry on these errors
  if (errorStr.includes('403') || 
      errorStr.includes('forbidden') ||
      errorStr.includes('blocked') ||
      errorStr.includes('429') ||
      errorStr.includes('too many requests') ||
      errorStr.includes('timeout') ||
      errorStr.includes('aborted')) {
    return { retry: true, reason: errorStr };
  }
  
  return { retry: false, reason: 'non_retryable_error' };
}

/**
 * Generate headers with fresh spoofing for each attempt
 * @param {number} attempt - Attempt number
 * @returns {Object} Headers object
 */
function generateAttemptHeaders(attempt) {
  // Change IP on each retry attempt
  const ip = getRandomIP();
  const ip2 = getRandomIP();
  
  // Change User-Agent on each retry
  const ua = attempt % 3 === 0 ? 
    generateUserAgentFor('tiktok') : 
    (attempt % 2 === 0 ? 
      generateUserAgentFor('android') : 
      generateUserAgentFor('desktop'));
  
  // Change referer on each retry
  const referers = [
    'https://www.tiktok.com/',
    'https://www.tiktok.com/feed',
    'https://www.tiktok.com/foryou',
    'https://www.tiktok.com/trending',
  ];
  const referer = referers[attempt % referers.length];
  
  return {
    'User-Agent': ua,
    'X-Forwarded-For': ip,
    'X-Real-IP': ip2,
    'X-Client-IP': ip,
    'CF-Connecting-IP': ip,
    'Referer': referer,
    'Origin': 'https://www.tiktok.com',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'en-US,en;q=0.9',
  };
}

/**
 * Sleep/delay function
 * @param {number} ms - Milliseconds to sleep
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================
// Engine 1: Savetik
// ============================================
async function fetchSavetik(url, signal, requestId, customHeaders = {}) {
  const headers = {
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'en-US,en;q=0.9',
    'Referer': 'https://www.savetik.com/',
    'Origin': 'https://www.savetik.com',
    ...customHeaders,
  };

  try {
    const response = await fetch('https://www.savetik.com/api/v1/video/download?url=' + encodeURIComponent(url), {
      method: 'GET',
      headers,
      signal,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      if (isBlocked(response.status, errorText)) {
        throw new Error(`403/Blocked: ${response.status}`);
      }
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    
    if (data.status && data.data) {
      const videoData = data.data;
      return {
        title: videoData.title || 'TikTok Video',
        author: videoData.author?.name || videoData.author?.username || 'Unknown',
        cover: videoData.thumbnail || videoData.cover || '',
        videoUrl: videoData.video?.hd || videoData.video?.sd || videoData.url || '',
        videoUrlHd: videoData.video?.hd || '',
        videoUrlSd: videoData.video?.sd || '',
        music: videoData.music?.url || '',
        duration: videoData.duration || 0,
      };
    }

    // Try scraping fallback
    return await scrapeSavetik(url, signal, requestId, customHeaders);
  } catch (error) {
    console.log(`[${requestId}] Savetik API failed: ${error.message}`);
    return await scrapeSavetik(url, signal, requestId, customHeaders);
  }
}

async function scrapeSavetik(url, signal, requestId, customHeaders = {}) {
  const headers = {
    'User-Agent': customHeaders['User-Agent'] || generateUserAgentFor('desktop'),
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Referer': 'https://www.savetik.com/',
    ...customHeaders,
  };

  const response = await fetch('https://www.savetik.com/download?url=' + encodeURIComponent(url), {
    method: 'GET',
    headers,
    signal,
  });

  if (!response.ok) throw new Error(`Scraping failed: ${response.status}`);

  const html = await response.text();
  
  // Extract video URL from HTML
  const videoMatch = html.match(/"video"?["\s:]+(["\']?)([^"\']+)\1/i) || 
                    html.match(/href=["']([^"']+\.mp4[^"']*)["']/i);
  
  if (videoMatch) {
    return {
      title: 'TikTok Video',
      cover: html.match(/<img[^>]+src=["']([^"']+)["']/i)?.[1] || '',
      videoUrl: videoMatch[2] || videoMatch[1],
      videoUrlHd: videoMatch[2] || videoMatch[1],
    };
  }

  throw new Error('No video URL found in Savetik response');
}

// ============================================
// Engine 2: Snaptik
// ============================================
async function fetchSnaptik(url, signal, requestId, customHeaders = {}) {
  const headers = {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Referer': 'https://snaptik.app/',
    'Origin': 'https://snaptik.app',
    ...customHeaders,
  };

  try {
    const response = await fetch('https://snaptik.app/abc?url=' + encodeURIComponent(url), {
      method: 'GET',
      headers,
      signal,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      if (isBlocked(response.status, errorText)) {
        throw new Error(`403/Blocked: ${response.status}`);
      }
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();
    
    // Extract from Snaptik's various patterns
    const patterns = [
      /data-src=["']([^"']+)["'][^>]*>.*?video/i,
      /href=["']([^"']*\.mp4[^"']*)["']/i,
      /videoUrl["\s:]+(["\']?)([^"\']+)\1/i,
      /"hd"["\s:]+(["\']?)([^"\']+)\1/i,
    ];

    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        return {
          title: 'TikTok Video',
          cover: html.match(/<meta[^>]+og:image["'][^>]*content=["']([^"']+)["']/i)?.[1] || '',
          videoUrl: match[1],
          videoUrlHd: match[1],
        };
      }
    }

    throw new Error('No video URL in Snaptik response');
  } catch (error) {
    console.log(`[${requestId}] Snaptik failed: ${error.message}`);
    throw error;
  }
}

// ============================================
// Engine 3: SSSTik (Last Fallback)
// ============================================
async function fetchSSSTik(url, signal, requestId, customHeaders = {}) {
  const headers = {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Content-Type': 'application/x-www-form-urlencoded',
    'Referer': 'https://ssstik.org/',
    'Origin': 'https://ssstik.org',
    ...customHeaders,
  };

  try {
    const response = await fetch('https://ssstik.org/full', {
      method: 'POST',
      headers,
      body: 'id=' + encodeURIComponent(url) + '&tt=FBEN',
      signal,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      if (isBlocked(response.status, errorText)) {
        throw new Error(`403/Blocked: ${response.status}`);
      }
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();
    
    // Extract from SSSTik response
    const videoMatch = html.match(/href=["']([^"']*mp4[^"']*)["']/i) ||
                       html.match(/video["\s:]+(["\']?)([^"\']+)\1/i);
    
    const musicMatch = html.match(/audio["\s:]+(["\']?)([^"\']+)\1/i);
    const coverMatch = html.match(/<img[^>]+src=["']([^"']+)["']/i);

    if (videoMatch) {
      return {
        title: html.match(/<h2[^>]*>([^<]+)<\/h2>/i)?.[1] || 'TikTok Video',
        author: html.match(/@[\w.]+/i)?.[0] || 'Unknown',
        cover: coverMatch?.[1] || '',
        videoUrl: videoMatch[1] || videoMatch[2] || '',
        videoUrlHd: videoMatch[1] || videoMatch[2] || '',
        music: musicMatch?.[1] || musicMatch?.[2] || '',
      };
    }

    throw new Error('No video URL in SSSTik response');
  } catch (error) {
    console.log(`[${requestId}] SSSTik failed: ${error.message}`);
    throw error;
  }
}