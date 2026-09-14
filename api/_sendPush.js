import webpush from 'web-push';
import { redisDel, redisGet } from './_redis.js';

const VAPID_PUBLIC_KEY = 'BNDbJvOU-1b5Lw666E6ivf1L8S7jp3uvPjLp2Upmma4QS1MUlGFfjsCpxU7LOUpcClqcPm0thXiQ_VcEJxFfjKw';

export async function sendPush(payload) {
  if (!process.env.VAPID_PRIVATE_KEY) throw new Error('VAPID_PRIVATE_KEY non configurato');
  const sub = await redisGet('rossella:pushSubscription');
  if (!sub) return { sent: false, reason: 'no-subscription' };
  webpush.setVapidDetails('mailto:rossella-training@vercel.app', VAPID_PUBLIC_KEY, process.env.VAPID_PRIVATE_KEY);
  try {
    await webpush.sendNotification(sub, JSON.stringify(payload), { TTL: 60 * 60 * 6 });
    return { sent: true };
  } catch (e) {
    if (e?.statusCode === 404 || e?.statusCode === 410) await redisDel('rossella:pushSubscription');
    throw e;
  }
}
