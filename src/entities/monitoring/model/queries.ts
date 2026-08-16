import { useQuery } from '@tanstack/react-query'
import {
  getAllSessionsOverview,
  getSessionStatistics,
  getSessionDetails,
  getCandidatesProgress,
} from '../api/monitoringApi'
import { queryKeys } from '@/shared/api/queryKeys'

export function useAllSessionsOverviewQuery() {
  return useQuery({
    queryKey: queryKeys.monitoringSessions,
    queryFn: () => getAllSessionsOverview(),
  })
}

export function useMonitoringStatisticsQuery(sessionId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.monitoringStatistics(sessionId ?? ''),
    queryFn: () => getSessionStatistics(sessionId as string),
    enabled: !!sessionId,
  })
}

export function useMonitoringSessionQuery(sessionId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.monitoringSession(sessionId ?? ''),
    queryFn: () => getSessionDetails(sessionId as string),
    enabled: !!sessionId,
  })
}

export function useCandidatesProgressQuery(sessionId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.monitoringProgress(sessionId ?? ''),
    queryFn: () => getCandidatesProgress(sessionId as string),
    enabled: !!sessionId,
  })
}
