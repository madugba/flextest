import { useState, useEffect, useCallback } from 'react'
import { getSessionAnalysis, type SessionAnalysis } from '@/entities/exam-session'

/**
 * Hook for fetching and managing session analysis data
 * Handles loading states, errors, and data refetching
 */
export function useReportAnalysis(sessionId: string | null) {
  const [analysis, setAnalysis] = useState<SessionAnalysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAnalysis = useCallback(async () => {
    if (!sessionId) return

    setLoading(true)
    setError(null)

    try {
      const data = await getSessionAnalysis(sessionId)
      setAnalysis(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch session analysis'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [sessionId])

  useEffect(() => {
    if (sessionId) {
      fetchAnalysis()
    } else {
      setAnalysis(null)
      setError(null)
    }
  }, [sessionId, fetchAnalysis])

  return {
    analysis,
    loading,
    error,
    refetch: fetchAnalysis,
  }
}

