import { useQuery } from '@tanstack/react-query'
import { getDashboardMetrics, getSystemMetrics, getBusinessMetrics } from '@/entities/metrics/api/metricsApi'
import type { DashboardMetrics, SystemMetrics, BusinessMetrics } from '@/entities/metrics/api/metricsApi'

/**
 * React Query hooks for dashboard metrics
 * Data is updated via SSE stream - no polling needed
 * Each hook fetches independently - only components using the specific hook re-render
 */

/**
 * Hook for complete dashboard metrics
 * Initial fetch only - updates come from SSE stream
 */
export function useDashboardMetrics() {
  return useQuery<DashboardMetrics>({
    queryKey: ['metrics', 'dashboard'],
    queryFn: getDashboardMetrics,
    staleTime: Infinity, // Never stale - SSE keeps it fresh
    gcTime: 10 * 60 * 1000, // Cache for 10 minutes
  })
}

/**
 * Hook for system metrics only (CPU, memory, server status)
 * Components using this won't re-render when business metrics change
 */
export function useSystemMetrics() {
  return useQuery<SystemMetrics>({
    queryKey: ['metrics', 'system'],
    queryFn: getSystemMetrics,
    staleTime: Infinity, // SSE updates
    gcTime: 10 * 60 * 1000,
  })
}

/**
 * Hook for business metrics only (centers, admins, sessions)
 * Components using this won't re-render when system metrics change
 */
export function useBusinessMetrics() {
  return useQuery<BusinessMetrics>({
    queryKey: ['metrics', 'business'],
    queryFn: getBusinessMetrics,
    staleTime: Infinity, // SSE updates
    gcTime: 10 * 60 * 1000,
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
