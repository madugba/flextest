import { apiClient } from '@/shared/api/client'
import type { Center } from '@/shared/api/centerApi'

let centerCache: boolean | null = null
let cacheTime = 0
const CACHE_TTL = 30 * 24 * 60 * 60 * 1000

export async function getCenterExists(): Promise<boolean> {
  const now = Date.now()

  if (centerCache !== null && now - cacheTime < CACHE_TTL) {
    return centerCache
  }

  try {
    const response = await apiClient.get<Center[]>('/center', {
      timeout: 2000,
    })

    // Check if response is successful and data is not empty
    const exists = response.success && Array.isArray(response.data) && response.data.length > 0

    if (exists) {
      centerCache = exists
      cacheTime = now
    }

    return exists
  } catch {
    return centerCache ?? false
  }
}

export function clearCenterCache(): void {
  centerCache = null
  cacheTime = 0
}
