import { COOKIE_NAME, getCookie, verifyToken } from './_auth.js';
import { redisGet } from './_redis.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Metodo non consentito' });
  if (!verifyToken(getCookie(req, COOKIE_NAME))) return res.status(401).json({ error: 'Non autorizzato' });
  try {
    const sub = await redisGet('rossella:pushSubscription');
    return res.status(200).json({
      subscribed: !!sub,
      qstash: !!process.env.QSTASH_TOKEN,
      vapid: !!process.env.VAPID_PRIVATE_KEY,
      redis: true
    });
  } catch (e) {
    return res.status(200).json({ subscribed: false, qstash: !!process.env.QSTASH_TOKEN, vapid: !!process.env.VAPID_PRIVATE_KEY, redis: false, error: e.message });
  }
}
