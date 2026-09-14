import { Client } from '@upstash/qstash';
import { COOKIE_NAME, getCookie, verifyToken } from './_auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Metodo non consentito' });
  if (!verifyToken(getCookie(req, COOKIE_NAME))) return res.status(401).json({ error: 'Non autorizzato' });
  if (!process.env.QSTASH_TOKEN) return res.status(500).json({ error: 'QSTASH_TOKEN non configurato' });
  if (!process.env.APP_AUTH_SECRET) return res.status(500).json({ error: 'APP_AUTH_SECRET non configurato' });
  try {
    const proto = req.headers['x-forwarded-proto'] || 'https';
    const host = process.env.VERCEL_PROJECT_PRODUCTION_URL || req.headers['x-forwarded-host'] || req.headers.host;
    const destination = `${proto}://${host}/api/send-workout-reminder`;
    const client = new Client({ token: process.env.QSTASH_TOKEN });
    const out = await client.schedules.create({
      destination,
      scheduleId: 'rossella-workout-11-rome',
      cron: 'CRON_TZ=Europe/Rome 0 11 * * *',
      retries: 1,
      headers: { 'x-rossella-reminder-secret': process.env.APP_AUTH_SECRET },
      body: JSON.stringify({ source: 'rossella-training' })
    });
    return res.status(200).json({ ok: true, scheduleId: out.scheduleId || 'rossella-workout-11-rome', cron: '11:00 Europe/Rome' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e.message || 'Impossibile creare la pianificazione' });
  }
}
