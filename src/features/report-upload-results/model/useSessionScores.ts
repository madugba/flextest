import { useCallback, useEffect, useState } from 'react'
import { getSessionScores, type SessionScores } from '@/entities/exam-session'

/** Loads the candidate x subject score matrix for a session, used to build push payloads. */
export function useSessionScores(sessionId: string | null, enabled: boolean) {
  const [scores, setScores] = useState<SessionScores | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!sessionId) return
    setIsLoading(true)
    setError(null)
    try {
      setScores(await getSessionScores(sessionId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load session scores')
    } finally {
      setIsLoading(false)
    }
  }, [sessionId])

  useEffect(() => {
    if (enabled && sessionId) load()
  }, [enabled, sessionId, load])

  return { scores, isLoading, error }
}
