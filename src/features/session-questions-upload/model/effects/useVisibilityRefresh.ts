'use client'

import { useEffect } from 'react'

export function useVisibilityRefresh(
  sessionId: string,
  loadSessionAndStats: (bypassCache?: boolean) => Promise<void>
): void {
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && sessionId) {
        loadSessionAndStats(true)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [sessionId, loadSessionAndStats])
}
