import config from '../config.js';
import { buildMeta, timeoutSignal } from '../helpers.js';

/**
 * Fetch video data from TikWM API using native fetch.
 * No external dependencies required.
 */
export async function fetchFromTikWM(url) {
  const { signal, clear } = timeoutSignal(config.tikwm.timeout);

  try {
    const res = await fetch(config.tikwm.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
      },
      body: new URLSearchParams({ url, hd: '1' }).toString(),
      signal,
    });

    clear();

    if (!res.ok) {
      throw new Error(`TikWM HTTP error: ${res.status}`);
    }

    const json = await res.json();
    
    // TikWM error codes: 0 = success, -1 = generic error, etc.
    if (json?.code === 0 && json?.data) {
      return {
        success: true,
        source: 'tikwm',
        ...buildMeta(json.data),
      };
    }

    const msg = json?.msg || 'TikWM returned non-zero code';
    if (msg.includes('not found') || msg.includes('does not exist')) {
      throw new Error('DELETED_VIDEO');
    }
    if (msg.includes('private')) {
      throw new Error('PRIVATE_VIDEO');
    }
    
    throw new Error(msg);
  } catch (err) {
    clear();
    // Rethrow to be caught by the handler
    throw err;
  }
}
