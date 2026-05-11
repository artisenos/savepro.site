import axios from 'axios';
import config from '../config.js';
import { buildMeta, timeoutSignal } from '../helpers.js';

export async function fetchFromTikWM(url) {
  const { signal, clear } = timeoutSignal(config.tikwm.timeout);

  try {
    const res = await axios({
      method: 'POST',
      url: config.tikwm.baseUrl,
      data: new URLSearchParams({ url, hd: '1' }).toString(),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
      },
      signal,
    });

    clear();

    if (res.data?.code === 0 && res.data?.data) {
      return {
        source: 'tikwm',
        ...buildMeta(res.data.data),
      };
    }

    throw new Error(res.data?.msg || 'TikWM returned non-zero code');
  } catch (err) {
    clear();
    throw err;
  }
}
