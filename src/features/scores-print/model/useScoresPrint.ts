import { useState, useEffect, useCallback } from 'react'
import { getSessionScores, getExamSessionById, type SessionScores, type ExamSession } from '@/entities/exam-session'

/**
 * Hook for fetching session and scores data for PDF generation
 * Combines session details and scores data
 */
export function useScoresPrint(sessionId: string | null) {
  const [session, setSession] = useState<ExamSession | null>(null)
  const [scores, setScores] = useState<SessionScores | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    if (!sessionId) return

    setLoading(true)
    setError(null)

    try {
      const [sessionData, scoresData] = await Promise.all([
        getExamSessionById(sessionId),
        getSessionScores(sessionId),
      ])

      setSession(sessionData)
      setScores(scoresData)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch scores data'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [sessionId])

  useEffect(() => {
    if (sessionId) {
      fetchData()
    } else {
      setSession(null)
      setScores(null)
      setError(null)
    }
  }, [sessionId, fetchData])

  return {
    session,
    scores,
    loading,
    error,
    refetch: fetchData,
  }
}

