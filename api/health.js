import { setCorsHeaders, setSecurityHeaders } from './_lib/helpers.js';

export default async function handler(req, res) {
  setCorsHeaders(res);
  setSecurityHeaders(res);

  if (req.method === 'OPTIONS') return res.status(200).end();

  res.status(200).json({
    status: 'ok',
    timestamp: Date.now(),
  });
}
