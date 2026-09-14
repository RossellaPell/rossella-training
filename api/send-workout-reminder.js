import { redisGet } from './_redis.js';
import { sendPush } from './_sendPush.js';

function romeDateKey() {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Rome', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
  const p = Object.fromEntries(parts.map(x => [x.type, x.value]));
  return `${p.year}-${p.month}-${p.day}`;
}

const TITLES = {
  A: 'Gambe Compatte, Ali & Dorso Profondo',
  B: 'Glutei Alti & Punto Vita',
  C: 'Tono Gambe, Cavi & Drenaggio Linfatico'
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Metodo non consentito' });
  if (!process.env.APP_AUTH_SECRET || req.headers['x-rossella-reminder-secret'] !== process.env.APP_AUTH_SECRET) {
    return res.status(401).json({ error: 'Richiesta non autorizzata' });
  }
  try {
    const days = (await redisGet('rossella:trainingDays')) || [];
    const today = romeDateKey();
    const sorted = [...new Set(days)].sort();
    const index = sorted.indexOf(today);
    if (index < 0) return res.status(200).json({ ok: true, sent: false, reason: 'rest-day', today });
    const sheet = ['A', 'B', 'C'][index % 3];
    const result = await sendPush({
      title: 'Rossella Training 💪',
      body: `Oggi è giorno di Scheda ${sheet} · ${TITLES[sheet]}`,
      url: `/?sheet=${sheet}`,
      tag: `workout-${today}`
    });
    return res.status(200).json({ ok: true, sheet, today, ...result });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e.message || 'Errore invio notifica' });
  }
}
