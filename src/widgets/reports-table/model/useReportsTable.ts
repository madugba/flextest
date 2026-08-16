'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useQueries } from '@tanstack/react-query'
import {
  useCompletedExamSessionsQuery,
  getSessionAnalysis,
  getSessionStatistics,
  type ExamSession,
  type SessionStatistics,
} from '@/entities/exam-session'
import { queryKeys } from '@/shared/api/queryKeys'

export interface SessionWithStats extends ExamSession {
  statistics?: SessionStatistics
}

type SortField = 'name' | 'date' | 'passRate'
type SortOrder = 'asc' | 'desc'

interface UseReportsTableProps {
  refreshTrigger?: number
}

export function useReportsTable(props?: UseReportsTableProps) {
  const { refreshTrigger = 0 } = props || {}

  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<SortField>('date')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')

  const sessionsQuery = useCompletedExamSessionsQuery()
  const sessions = useMemo(() => sessionsQuery.data ?? [], [sessionsQuery.data])

  const statsQueries = useQueries({
    queries: sessions.map((session) => ({
      queryKey: queryKeys.sessionStatistics(session.id),
      queryFn: () => getSessionStatistics(session.id),
    })),
  })

  const analysisQueries = useQueries({
    queries: sessions.map((session) => ({
      queryKey: queryKeys.sessionAnalysis(session.id),
      queryFn: () => getSessionAnalysis(session.id),
    })),
  })

  const sessionsWithStats: SessionWithStats[] = useMemo(() => {
    return sessions.map((session, index) => {
      const statsQuery = statsQueries[index]
      const analysisQuery = analysisQueries[index]

      const statistics: SessionStatistics = {
        scheduled: statsQuery?.data?.scheduled ?? 0,
        absent: statsQuery?.data?.absent ?? 0,
        submitted: statsQuery?.data?.submitted ?? 0,
        passPercentage: analysisQuery?.data?.passingTrend?.passPercentage,
        passCount: analysisQuery?.data?.passingTrend?.pass,
        failCount: analysisQuery?.data?.passingTrend?.fail,
      }

      return { ...session, statistics }
    })
  }, [sessions, statsQueries, analysisQueries])

  const loading =
    sessionsQuery.isLoading ||
    statsQueries.some((q) => q.isLoading) ||
    analysisQueries.some((q) => q.isLoading)

  const error = sessionsQuery.error?.message ?? null

  useEffect(() => {
    statsQueries.forEach((query, index) => {
      if (query.isError) {
        console.error(`[reports] stats failed for ${sessions[index]?.id}:`, query.error)
      }
    })
    analysisQueries.forEach((query, index) => {
      if (query.isError) {
        console.error(`[reports] analysis failed for ${sessions[index]?.id}:`, query.error)
      }
    })
  }, [sessions, statsQueries, analysisQueries])

  const refetch = useCallback(async () => {
    await Promise.all([
      sessionsQuery.refetch(),
      ...statsQueries.map((query) => query.refetch()),
      ...analysisQueries.map((query) => query.refetch()),
    ])
  }, [sessionsQuery, statsQueries, analysisQueries])

  useEffect(() => {
    if (refreshTrigger > 0) {
      void refetch()
    }
  }, [refreshTrigger, refetch])

  const filteredSessions = useMemo(() => {
    let filtered = sessionsWithStats.filter((session) =>
      session.name.toLowerCase().includes(search.toLowerCase())
    )

    filtered = filtered.sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
          break
        case 'passRate': {
          const aPassRate = typeof a.statistics?.passPercentage === 'number' ? a.statistics.passPercentage : 0
          const bPassRate = typeof b.statistics?.passPercentage === 'number' ? b.statistics.passPercentage : 0
          comparison = aPassRate - bPassRate
          break
        }
        default:
          comparison = 0
      }

      return sortOrder === 'asc' ? comparison : -comparison
    })

    return filtered
  }, [sessionsWithStats, search, sortBy, sortOrder])

  return {
    sessions: filteredSessions,
    loading,
    error,
    search,
    setSearch,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    refetch,
  }
}
