export default function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Metodo non consentito' });
  const status = {
    APP_USERNAME: Boolean(process.env.APP_USERNAME),
    APP_PASSWORD: Boolean(process.env.APP_PASSWORD),
    APP_AUTH_SECRET: Boolean(process.env.APP_AUTH_SECRET),
    environment: process.env.VERCEL_ENV || 'unknown'
  };
  return res.status(200).json(status);
}
