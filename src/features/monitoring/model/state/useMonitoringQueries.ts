import { useQuery } from '@tanstack/react-query'
import { useRef } from 'react'
import { getSessionStatistics, getSessionDetails } from '@/entities/monitoring'

interface UseMonitoringQueriesArgs {
  sessionId?: string
  autoRefresh: boolean
}

export function useMonitoringQueries({ sessionId, autoRefresh }: UseMonitoringQueriesArgs) {
  // Captured on every render so the control mutation's onSuccess callback sees
  // the latest sessionDuration without a stale closure.
  const sessionDurationSecondsRef = useRef(0)

  const {
    data: sessionStats,
    isLoading: isLoadingStats,
    error: statsError,
    refetch: refetchStats,
  } = useQuery({
    queryKey: ['monitoring', 'session', sessionId, 'statistics'],
    queryFn: () => getSessionStatistics(sessionId!),
    enabled: Boolean(sessionId),
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    // Auto-refresh stats counts (active/absent/submitted) on a timer.
    refetchInterval: autoRefresh ? 30_000 : (false as const),
  })

  const {
    data: sessionDetails,
    isLoading: isLoadingDetails,
    isFetching: isFetchingDetails,
    error: detailsError,
    refetch: refetchDetails,
  } = useQuery({
    queryKey: ['monitoring', 'session', sessionId, 'details'],
    queryFn: () => getSessionDetails(sessionId!),
    enabled: Boolean(sessionId),
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    // No refetchInterval — the details endpoint doesn't include progress.
    // Progress is kept live via socket events + syncCandidatesProgress.
  })

  if (sessionStats?.sessionDuration) {
    sessionDurationSecondsRef.current = sessionStats.sessionDuration * 60
  }

  return {
    sessionStats,
    isLoadingStats,
    statsError,
    refetchStats,
    sessionDetails,
    isLoadingDetails,
    isFetchingDetails,
    detailsError,
    refetchDetails,
    sessionDurationSecondsRef,
  }
}
