import { useQuery } from '@tanstack/react-query'
import { getDashboardMetrics, getActivityEvents } from '../api/metricsApi'
import { queryKeys } from '@/shared/api/queryKeys'

export function useDashboardMetricsQuery() {
  return useQuery({
    queryKey: queryKeys.metricsSummary,
    queryFn: () => getDashboardMetrics(),
  })
}

export function useActivityEventsQuery(limit: number = 20) {
  return useQuery({
    queryKey: [...queryKeys.metricsActivity, limit],
    queryFn: () => getActivityEvents(limit),
  })
}
