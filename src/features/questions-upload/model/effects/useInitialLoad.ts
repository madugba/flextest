'use client'

import { useEffect } from 'react'

export function useInitialLoad(
  subjectId: string,
  sessionId: string,
  loadData: (bypassCache?: boolean) => Promise<void>
): void {
  useEffect(() => {
    if (subjectId && sessionId) {
      loadData()
    }
  }, [subjectId, sessionId, loadData])
}
