import { COOKIE_NAME, getCookie, verifyToken } from './_auth.js';
export default function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Metodo non consentito' });
  const ok = verifyToken(getCookie(req, COOKIE_NAME));
  return res.status(ok ? 200 : 401).json({ authenticated: ok });
}
