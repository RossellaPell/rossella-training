import crypto from 'node:crypto';

export const COOKIE_NAME = 'rossella_auth';

export function safeEqual(a = '', b = '') {
  const aa = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  if (aa.length !== bb.length) return false;
  return crypto.timingSafeEqual(aa, bb);
}

export function createToken(username) {
  const secret = process.env.APP_AUTH_SECRET;
  if (!secret) throw new Error('APP_AUTH_SECRET non configurato');
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30;
  const payload = `${encodeURIComponent(username)}.${exp}`;
  const sig = crypto.createHmac('sha256', secret).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}

export function verifyToken(token = '') {
  const secret = process.env.APP_AUTH_SECRET;
  if (!secret) return false;
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  const [user, exp, sig] = parts;
  if (!/^\d+$/.test(exp) || Number(exp) < Math.floor(Date.now() / 1000)) return false;
  const payload = `${user}.${exp}`;
  const expected = crypto.createHmac('sha256', secret).update(payload).digest('base64url');
  return safeEqual(sig, expected);
}

export function getCookie(req, name) {
  const raw = req.headers.cookie || '';
  for (const part of raw.split(';')) {
    const [k, ...rest] = part.trim().split('=');
    if (k === name) return rest.join('=');
  }
  return '';
}
