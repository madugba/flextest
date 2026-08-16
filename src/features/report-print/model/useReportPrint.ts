'use client'

import { useCallback } from 'react'
import { useExamSessionQuery, useSessionAnalysisQuery } from '@/entities/exam-session'

export function useReportPrint(sessionId: string | null) {
  const sessionQuery = useExamSessionQuery(sessionId ?? undefined)
  const analysisQuery = useSessionAnalysisQuery(sessionId ?? undefined)

  const session = sessionQuery.data ?? null
  const analysis = analysisQuery.data ?? null

  const loading = sessionQuery.isLoading || analysisQuery.isLoading

  const error =
    sessionQuery.error?.message ??
    analysisQuery.error?.message ??
    null

  const refetch = useCallback(async () => {
    await Promise.all([sessionQuery.refetch(), analysisQuery.refetch()])
  }, [sessionQuery, analysisQuery])

  return {
    session,
    analysis,
    loading,
    error,
    refetch,
  }
}
