'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { getSessionScores, type SessionScores } from '@/entities/exam-session'
import { toast } from 'sonner'

export function useSessionScoresTable(sessionId: string) {
  const [scores, setScores] = useState<SessionScores | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const fetchScores = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const data = await getSessionScores(sessionId)
      setScores(data)
    } catch (err) {
      console.error('Error fetching session scores:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to load scores'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [sessionId])

  useEffect(() => {
    if (sessionId) {
      fetchScores()
    }
  }, [sessionId, fetchScores])

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
    refetch: fetchScores,
    search,
    setSearch,
    filteredCandidates,
  }
}

