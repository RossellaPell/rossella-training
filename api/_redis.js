function redisConfig() {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) throw new Error('Redis/Upstash non configurato');
  return { url: url.replace(/\/$/, ''), token };
}

async function command(args) {
  const { url, token } = redisConfig();
  const r = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(args)
  });
  if (!r.ok) throw new Error(`Redis error ${r.status}`);
  const data = await r.json();
  if (data.error) throw new Error(data.error);
  return data.result;
}

export async function redisSet(key, value) {
  return command(['SET', key, JSON.stringify(value)]);
}
export async function redisGet(key) {
  const result = await command(['GET', key]);
  if (result == null) return null;
  try { return JSON.parse(result); } catch { return result; }
}
export async function redisDel(key) {
  return command(['DEL', key]);
}
