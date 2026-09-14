const COOKIE_NAME = 'rossella_auth';
const PUBLIC_PATHS = new Set([
  '/login', '/login.html', '/api/login', '/api/session', '/manifest.webmanifest',
  '/icon-192.png', '/icon-512.png', '/apple-touch-icon.png', '/favicon.ico'
]);

function getCookie(request, name) {
  const raw = request.headers.get('cookie') || '';
  for (const part of raw.split(';')) {
    const [k, ...rest] = part.trim().split('=');
    if (k === name) return rest.join('=');
  }
  return '';
}

function base64url(bytes) {
  let binary = '';
  bytes.forEach(b => binary += String.fromCharCode(b));
  return btoa(binary).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
}

async function verifyToken(token) {
  const secret = process.env.APP_AUTH_SECRET;
  if (!secret || !token) return false;
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  const [user, exp, sig] = parts;
  if (!/^\d+$/.test(exp) || Number(exp) < Math.floor(Date.now()/1000)) return false;
  const payload = `${user}.${exp}`;
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), {name:'HMAC',hash:'SHA-256'}, false, ['sign']);
  const signed = new Uint8Array(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload)));
  const expected = base64url(signed);
  if (expected.length !== sig.length) return false;
  let diff = 0; for (let i=0;i<sig.length;i++) diff |= expected.charCodeAt(i)^sig.charCodeAt(i);
  return diff === 0;
}

export default async function middleware(request) {
  const url = new URL(request.url);
  if (PUBLIC_PATHS.has(url.pathname) || url.pathname.startsWith('/api/')) return;
  const ok = await verifyToken(getCookie(request, COOKIE_NAME));
  if (!ok) {
    const login = new URL('/login', request.url);
    return Response.redirect(login, 307);
  }
}

export const config = { matcher: ['/((?!_vercel/).*)'] };
