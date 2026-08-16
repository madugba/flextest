'use client'

import { useState, useEffect, useCallback } from 'react'
import { getSessionAnalysis, getExamSessionById, type SessionAnalysis, type ExamSession } from '@/entities/exam-session'

/**
 * Hook for fetching session data for PDF report generation
 * Combines session details and analysis data
 */
export function useReportPrint(sessionId: string | null) {
  const [session, setSession] = useState<ExamSession | null>(null)
  const [analysis, setAnalysis] = useState<SessionAnalysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    if (!sessionId) return

    setLoading(true)
    setError(null)

    try {
      const [sessionData, analysisData] = await Promise.all([
        getExamSessionById(sessionId),
        getSessionAnalysis(sessionId),
      ])

      setSession(sessionData)
      setAnalysis(analysisData)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch report data'
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
      setAnalysis(null)
      setError(null)
    }
  }, [sessionId, fetchData])

  return {
    session,
    analysis,
    loading,
    error,
    refetch: fetchData,
  }
}

