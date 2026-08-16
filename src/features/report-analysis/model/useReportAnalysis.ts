'use client'

import { useCallback } from 'react'
import {
  useExamSessionQuery,
  useSessionAnalysisQuery,
  useSessionStatisticsQuery,
} from '@/entities/exam-session'

export function useReportAnalysis(sessionId: string | null) {
  const sessionQuery = useExamSessionQuery(sessionId ?? undefined)
  const analysisQuery = useSessionAnalysisQuery(sessionId ?? undefined)
  const statisticsQuery = useSessionStatisticsQuery(sessionId ?? undefined)

  const analysis = analysisQuery.data ?? null

  const loading =
    sessionQuery.isLoading || analysisQuery.isLoading || statisticsQuery.isLoading

  const error =
    sessionQuery.error?.message ??
    analysisQuery.error?.message ??
    statisticsQuery.error?.message ??
    null

  const refetch = useCallback(async () => {
    await Promise.all([
      sessionQuery.refetch(),
      analysisQuery.refetch(),
      statisticsQuery.refetch(),
    ])
  }, [sessionQuery, analysisQuery, statisticsQuery])

  return {
    analysis,
    loading,
    error,
    refetch,
  }
}
