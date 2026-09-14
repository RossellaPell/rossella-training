import { COOKIE_NAME, getCookie, verifyToken } from './_auth.js';
import { sendPush } from './_sendPush.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Metodo non consentito' });
  if (!verifyToken(getCookie(req, COOKIE_NAME))) return res.status(401).json({ error: 'Non autorizzato' });
  try {
    const result = await sendPush({ title: 'Rossella Training 💪', body: 'Notifiche attive. Ti ricorderò l’allenamento alle 11:00.', url: '/' });
    return res.status(200).json({ ok: true, ...result });
  } catch (e) {
    return res.status(500).json({ error: e.message || 'Errore invio notifica' });
  }
}
