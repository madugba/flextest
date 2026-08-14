import { useEffect } from 'react'

interface SessionQuestionsInitialLoadDeps {
  sessionId: string
  router: { refresh: () => void }
  loadSessionAndStats: (bypassCache?: boolean) => Promise<void>
}

export function useSessionQuestionsInitialLoad({
  sessionId,
  router,
  loadSessionAndStats,
}: SessionQuestionsInitialLoadDeps): void {
  useEffect(() => {
    if (!sessionId) return

    const justUploaded = sessionStorage.getItem('questions-uploaded') === sessionId
    if (justUploaded) {
      sessionStorage.removeItem('questions-uploaded')
      router.refresh()
    }

    loadSessionAndStats(justUploaded)
  }, [sessionId, router, loadSessionAndStats])
}
