import { cache } from './cache'
import { getCenters } from '@/shared/api/centerApi'

const CACHE_KEY = 'center-exists'
const CACHE_TTL = 60_000
const pendingRequests = new Map<string, Promise<boolean>>()

export async function checkCenterExists(): Promise<boolean> {
  const cached = cache.get(CACHE_KEY)
  if (cached !== null) {
    return cached
  }

  const pending = pendingRequests.get(CACHE_KEY)
  if (pending) {
    return pending
  }

  const promise = getCenters()
    .then((centers) => {
      const exists = centers.length > 0
      cache.set(CACHE_KEY, exists, CACHE_TTL)
      pendingRequests.delete(CACHE_KEY)
      return exists
    })
    .catch((error) => {
      pendingRequests.delete(CACHE_KEY)
      throw error
    })

  pendingRequests.set(CACHE_KEY, promise)
  return promise
}
