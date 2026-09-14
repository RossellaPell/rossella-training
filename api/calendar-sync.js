import { COOKIE_NAME, getCookie, verifyToken } from './_auth.js';
import { redisSet } from './_redis.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Metodo non consentito' });
  if (!verifyToken(getCookie(req, COOKIE_NAME))) return res.status(401).json({ error: 'Non autorizzato' });
  const days = Array.isArray(req.body?.trainingDays) ? req.body.trainingDays : [];
  const clean = [...new Set(days.filter(x => /^\d{4}-\d{2}-\d{2}$/.test(String(x))))].sort();
  try {
    await redisSet('rossella:trainingDays', clean);
    return res.status(200).json({ ok: true, count: clean.length });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
