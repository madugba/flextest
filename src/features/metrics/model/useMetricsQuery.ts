import { useQuery } from '@tanstack/react-query'
import { getDashboardMetrics, getSystemMetrics, getBusinessMetrics } from '@/entities/metrics/api/metricsApi'
import type { DashboardMetrics, SystemMetrics, BusinessMetrics } from '@/entities/metrics/api/metricsApi'

export function useDashboardMetrics() {
  const cacheDurationMs = 10 * 60 * 1000
  return useQuery<DashboardMetrics>({
    queryKey: ['metrics', 'dashboard'],
    queryFn: getDashboardMetrics,
    staleTime: Infinity,
    gcTime: cacheDurationMs,
  })
}

export function useSystemMetrics() {
  const cacheDurationMs = 10 * 60 * 1000
  return useQuery<SystemMetrics>({
    queryKey: ['metrics', 'system'],
    queryFn: getSystemMetrics,
    staleTime: Infinity,
    gcTime: cacheDurationMs,
  })
}

export function useBusinessMetrics() {
  const cacheDurationMs = 10 * 60 * 1000
  return useQuery<BusinessMetrics>({
    queryKey: ['metrics', 'business'],
    queryFn: getBusinessMetrics,
    staleTime: Infinity,
    gcTime: cacheDurationMs,
  })
}

/**
 * Selector hooks - extract specific values from dashboard metrics
 * Use these for maximum performance - only re-render when the specific value changes
 */

export function useServerStatus() {
  const { data } = useDashboardMetrics()
  return {
    status: data?.system?.server?.status || 'unknown',
    uptime: data?.system?.server?.uptime || 0,
    timestamp: data?.system?.server?.timestamp || new Date().toISOString(),
  }
}

export function useCPUMetrics() {
  const { data } = useDashboardMetrics()
  return data?.system?.cpu
}

export function useMemoryMetrics() {
  const { data } = useDashboardMetrics()
  return data?.system?.memory
}

export function useConnectionMetrics() {
  const { data } = useDashboardMetrics()
  return data?.connections
}

export function usePerformanceMetrics() {
  const { data } = useDashboardMetrics()
  return data?.performance
}

/**
 * Hook for last update timestamp
 */
export function useLastUpdate() {
  const { dataUpdatedAt } = useDashboardMetrics()
  return dataUpdatedAt ? new Date(dataUpdatedAt) : null
}

/**
 * Hook for connection status
 */
export function useMetricsConnection() {
  const { isError, isLoading, isFetching } = useDashboardMetrics()
  return {
    connected: !isError && !isLoading,
    loading: isLoading,
    fetching: isFetching,
    error: isError,
  }
}
