import { COOKIE_NAME, getCookie, verifyToken } from './_auth.js';
import { redisDel } from './_redis.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Metodo non consentito' });
  if (!verifyToken(getCookie(req, COOKIE_NAME))) return res.status(401).json({ error: 'Non autorizzato' });
  try {
    await redisDel('rossella:pushSubscription');
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
