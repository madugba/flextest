'use client'

import { useSessionScoresQuery } from '@/entities/exam-session'

/** Loads the candidate x subject score matrix for a session, used to build push payloads. */
export function useSessionScores(sessionId: string | null, enabled: boolean) {
  const query = useSessionScoresQuery(enabled && sessionId ? sessionId : undefined)

  return {
    scores: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error?.message ?? null,
  }
}
