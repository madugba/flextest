import { getRedis } from './redis'

// ---------------------------------------------------------------------------
// Distributed lock — ensures only ONE Next.js worker runs the 5-min DB sync
// ---------------------------------------------------------------------------

const SYNC_LOCK = 'flextest:exam:timer:sync:lock'

export async function acquireSyncLock(instanceId: string): Promise<boolean> {
  try {
    const result = await getRedis().set(SYNC_LOCK, instanceId, 'EX', 120, 'NX')
    return result === 'OK'
  } catch {
    return false
  }
}

const RELEASE_LUA = `
  if redis.call('get', KEYS[1]) == ARGV[1] then
    return redis.call('del', KEYS[1])
  end
  return 0
`

export async function releaseSyncLock(instanceId: string): Promise<void> {
  try {
    await getRedis().eval(RELEASE_LUA, 1, SYNC_LOCK, instanceId)
  } catch {
    // Non-fatal — TTL will expire the lock anyway
  }
}
