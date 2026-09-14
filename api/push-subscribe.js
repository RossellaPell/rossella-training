import { COOKIE_NAME, getCookie, verifyToken } from './_auth.js';
import { redisSet } from './_redis.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Metodo non consentito' });
  if (!verifyToken(getCookie(req, COOKIE_NAME))) return res.status(401).json({ error: 'Non autorizzato' });
  const sub = req.body?.subscription;
  if (!sub?.endpoint || !sub?.keys?.p256dh || !sub?.keys?.auth) return res.status(400).json({ error: 'Sottoscrizione push non valida' });
  try {
    await redisSet('rossella:pushSubscription', sub);
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
