'use client'

import { useCallback, useMemo, useState } from 'react'
import { useSessionScoresQuery } from '@/entities/exam-session'

export function useSessionScoresTable(sessionId: string) {
  const scoresQuery = useSessionScoresQuery(sessionId)

  const scores = scoresQuery.data ?? null

  const loading = scoresQuery.isLoading

  const error = scoresQuery.error?.message ?? null

  const refetch = useCallback(async () => {
    await scoresQuery.refetch()
  }, [scoresQuery])

  const [search, setSearch] = useState('')

  const filteredCandidates = useMemo(() => {
    if (!scores) return []
    if (!search.trim()) return scores.candidates

    const searchLower = search.toLowerCase()
    return scores.candidates.filter((candidate) =>
      candidate.candidateName.toLowerCase().includes(searchLower)
    )
  }, [scores, search])

  return {
    scores,
    loading,
    error,
    refetch,
    search,
    setSearch,
    filteredCandidates,
  }
}
