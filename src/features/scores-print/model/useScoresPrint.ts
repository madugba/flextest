'use client'

import { useCallback } from 'react'
import { useExamSessionQuery, useSessionScoresQuery } from '@/entities/exam-session'

export function useScoresPrint(sessionId: string | null) {
  const sessionQuery = useExamSessionQuery(sessionId ?? undefined)
  const scoresQuery = useSessionScoresQuery(sessionId ?? undefined)

  const session = sessionQuery.data ?? null
  const scores = scoresQuery.data ?? null

  const loading = sessionQuery.isLoading || scoresQuery.isLoading

  const error =
    sessionQuery.error?.message ??
    scoresQuery.error?.message ??
    null

  const refetch = useCallback(async () => {
    await Promise.all([sessionQuery.refetch(), scoresQuery.refetch()])
  }, [sessionQuery, scoresQuery])

  return {
    session,
    scores,
    loading,
    error,
    refetch,
  }
}
