// ============================================
// SavePro API - AI Gateway Integration
// Uses VERCEL_AI_API_KEY as fallback when direct requests fail
// ============================================

const AI_GATEWAY_BASE = 'https://api.vercel.com/v1';

let aiGatewayConfig = null;

/**
 * Initialize AI Gateway configuration
 * @returns {Object|null} AI Gateway config or null
 */
export function initAIGateway() {
  const apiKey = process.env.VERCEL_AI_API_KEY;
  
  if (!apiKey) {
    console.log('🤖 AI Gateway: No VERCEL_AI_API_KEY configured');
    return null;
  }
  
  aiGatewayConfig = {
    apiKey: apiKey,
    enabled: true,
  };
  
  console.log('🤖 AI Gateway: Initialized successfully');
  return aiGatewayConfig;
}

/**
 * Check if AI Gateway is available
 * @returns {boolean} Is AI Gateway available
 */
export function isAIGatewayAvailable() {
  if (!aiGatewayConfig) {
    initAIGateway();
  }
  return aiGatewayConfig?.enabled || false;
}

/**
 * Get AI Gateway headers
 * @returns {Object} Auth headers for AI Gateway
 */
function getAIGatewayHeaders() {
  if (!aiGatewayConfig) {
    initAIGateway();
  }
  
  return {
    'Authorization': `Bearer ${aiGatewayConfig?.apiKey || ''}`,
    'Content-Type': 'application/json',
  };
}

/**
 * Process URL through AI Gateway as fallback
 * @param {string} url - TikTok URL to process
 * @returns {Object|null} Result or null
 */
export async function processWithAIGateway(url) {
  if (!isAIGatewayAvailable()) {
    console.log('🤖 AI Gateway: Not available, skipping');
    return null;
  }
  
  console.log('🤖 AI Gateway: Processing URL via AI Gateway');
  
  try {
    // Try using AI Gateway for URL resolution
    // Note: This is a placeholder - Vercel AI Gateway may not have direct TikTok support
    // This demonstrates the integration pattern
    
    const response = await fetch(`${AI_GATEWAY_BASE}/ai/inference`, {
      method: 'POST',
      headers: getAIGatewayHeaders(),
      body: JSON.stringify({
        model: 'text-capability-model',
        messages: [
          {
            role: 'user',
            content: `Process this TikTok URL and extract video info: ${url}`
          }
        ],
        max_tokens: 500,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`AI Gateway returned ${response.status}`);
    }
    
    const data = await response.json();
    console.log('🤖 AI Gateway: Response received');
    
    return data;
  } catch (error) {
    console.log('🤖 AI Gateway: Failed -', error.message);
    return null;
  }
}

/**
 * Alternative: Use AI Gateway for reCAPTCHA bypass hints
 * @param {string} errorType - Type of error encountered
 * @returns {Object} Suggestions for retry
 */
export async function getRetrySuggestions(errorType) {
  if (!isAIGatewayAvailable()) {
    return { suggest: false, action: 'retry_direct' };
  }
  
  try {
    // Use AI to analyze the error and suggest remediation
    const response = await fetch(`${AI_GATEWAY_BASE}/ai/inference`, {
      method: 'POST',
      headers: getAIGatewayHeaders(),
      body: JSON.stringify({
        model: 'text-capability-model',
        messages: [
          {
            role: 'system',
            content: 'You are a TikTok scraping expert. Analyze the error and suggest the best retry strategy.'
          },
          {
            role: 'user',
            content: `Error type: ${errorType}. What headers should we change for retry?`
          }
        ],
        max_tokens: 200,
      }),
    });
    
    if (!response.ok) {
      return { suggest: false, action: 'retry_direct' };
    }
    
    const data = await response.json();
    return {
      suggest: true,
      action: 'ai_guided_retry',
      guidance: data.choices?.[0]?.message?.content || '',
    };
  } catch {
    return { suggest: false, action: 'retry_direct' };
  }
}

/**
 * Scrub AI Gateway credentials from logs
 * @param {string} message - Log message
 * @returns {string} Sanitized message
 */
export function scrubAIGatewayCredentials(message) {
  if (!message) return '';
  
  let sanitized = message;
  
  // Scrub VERCEL_AI_API_KEY (vck_***)
  sanitized = sanitized.replace(/(vck_)[a-zA-Z0-9_=-]*/gi, '$1***');
  sanitized = sanitized.replace(/(VERCEL_AI_API_KEY|vercel[_-]?ai[_-]?api[_-]?key)["'":\s=]+[^\s&"']*/gi, '$1=***');
  
  // Scrub Bearer tokens
  sanitized = sanitized.replace(/(Bearer\s+)[a-zA-Z0-9_=-]+/gi, '$1***');
  
  return sanitized;
}

/**
 * Get AI Gateway status
 * @returns {Object} Status information
 */
export function getAIGatewayStatus() {
  if (!aiGatewayConfig) {
    initAIGateway();
  }
  
  return {
    available: isAIGatewayAvailable(),
    configured: !!process.env.VERCEL_AI_API_KEY,
    apiKeyPrefix: process.env.VERCEL_AI_API_KEY ? 
      process.env.VERCEL_AI_API_KEY.substring(0, 6) + '***' : null,
    timestamp: Date.now(),
  };
}