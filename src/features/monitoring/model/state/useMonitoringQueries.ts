'use client'

import { useEffect, useRef } from 'react'
import { useMonitoringStatisticsQuery, useMonitoringSessionQuery } from '@/entities/monitoring'

interface UseMonitoringQueriesArgs {
  sessionId?: string
  autoRefresh: boolean
}

export function useMonitoringQueries({ sessionId, autoRefresh }: UseMonitoringQueriesArgs) {
  // Captured on every render so the control mutation's onSuccess callback sees
  // the latest sessionDuration without a stale closure.
  const sessionDurationSecondsRef = useRef(0)

  const statsQuery = useMonitoringStatisticsQuery(sessionId)
  const detailsQuery = useMonitoringSessionQuery(sessionId)

  if (statsQuery.data?.sessionDuration) {
    sessionDurationSecondsRef.current = statsQuery.data.sessionDuration * 60
  }

  const refetchStatsRef = useRef(statsQuery.refetch)
  refetchStatsRef.current = statsQuery.refetch

  // Auto-refresh stats counts (active/absent/submitted) on a timer.
  useEffect(() => {
    if (!autoRefresh) return
    const interval = setInterval(() => {
      void refetchStatsRef.current()
    }, 30_000)
    return () => clearInterval(interval)
  }, [autoRefresh])

  return {
    sessionStats: statsQuery.data,
    isLoadingStats: statsQuery.isLoading,
    statsError: statsQuery.error,
    refetchStats: statsQuery.refetch,
    sessionDetails: detailsQuery.data,
    isLoadingDetails: detailsQuery.isLoading,
    isFetchingDetails: detailsQuery.isFetching,
    detailsError: detailsQuery.error,
    refetchDetails: detailsQuery.refetch,
    sessionDurationSecondsRef,
  }
}
