import config from '../config.js';

export function checkAuth(req) {
  if (config.apiKeys.length === 0) return null;
  const key = req.query?.api_key || req.headers['x-api-key'];
  if (!key || !config.apiKeys.includes(key)) {
    return { success: false, message: 'Invalid or missing API key.' };
  }
  return null;
}
