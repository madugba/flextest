import 'server-only'

import Redis from 'ioredis'

// ---------------------------------------------------------------------------
// Singleton ioredis client
// ---------------------------------------------------------------------------

let _client: Redis | null = null

function createClient(): Redis {
  const client = new Redis({
    host: process.env.REDIS_HOST ?? 'localhost',
    port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
    password: process.env.REDIS_PASSWORD || undefined,
    db: parseInt(process.env.REDIS_DB ?? '0', 10),
    lazyConnect: true,
    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
    enableOfflineQueue: false,
    connectTimeout: 10_000,
    commandTimeout: 5_000,
    retryStrategy: (times) => Math.min(times * 100, 3_000),
  })
  client.on('error', (err: Error) => {
    console.error('[examiner/redis] error:', err.message)
  })
  return client
}

export function getRedis(): Redis {
  if (!_client) _client = createClient()
  return _client
}

