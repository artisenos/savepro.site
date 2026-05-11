import { fetchFromTikWM } from './tikwm.js';

export async function downloadVideo(url) {
  const result = await fetchFromTikWM(url);
  return result;
}
