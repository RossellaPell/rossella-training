import { COOKIE_NAME, createToken, safeEqual } from './_auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Metodo non consentito' });
  const configuredUser = process.env.APP_USERNAME;
  const configuredPass = process.env.APP_PASSWORD;
  if (!configuredUser || !configuredPass || !process.env.APP_AUTH_SECRET) {
    return res.status(500).json({ error: 'Login non configurato sul server' });
  }
  const body = typeof req.body === 'object' && req.body ? req.body : {};
  const ok = safeEqual(body.username || '', configuredUser) && safeEqual(body.password || '', configuredPass);
  if (!ok) return res.status(401).json({ error: 'Utente o password non corretti' });
  const token = createToken(configuredUser);
  res.setHeader('Set-Cookie', `${COOKIE_NAME}=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=2592000`);
  return res.status(200).json({ ok: true });
}
