'use client'

import { useDashboardMetricsQuery } from '@/entities/metrics'
import type { SystemMetrics, BusinessMetrics } from '@/entities/metrics'

export function useDashboardMetrics() {
  return useDashboardMetricsQuery()
}

export function useSystemMetrics(): SystemMetrics | undefined {
  const { data } = useDashboardMetricsQuery()
  return data?.system
}

export function useBusinessMetrics(): BusinessMetrics | undefined {
  const { data } = useDashboardMetricsQuery()
  return data?.business
}

/**
 * Selector hooks - extract specific values from dashboard metrics
 * Use these for maximum performance - only re-render when the specific value changes
 */

export function useServerStatus() {
  const { data } = useDashboardMetricsQuery()
  return {
    status: data?.system?.server?.status || 'unknown',
    uptime: data?.system?.server?.uptime || 0,
    timestamp: data?.system?.server?.timestamp || new Date().toISOString(),
  }
}

export function useCPUMetrics() {
  const { data } = useDashboardMetricsQuery()
  return data?.system?.cpu
}

export function useMemoryMetrics() {
  const { data } = useDashboardMetricsQuery()
  return data?.system?.memory
}

export function useConnectionMetrics() {
  const { data } = useDashboardMetricsQuery()
  return data?.connections
}

export function usePerformanceMetrics() {
  const { data } = useDashboardMetricsQuery()
  return data?.performance
}

/**
 * Hook for last update timestamp
 */
export function useLastUpdate() {
  const { dataUpdatedAt } = useDashboardMetricsQuery()
  return dataUpdatedAt ? new Date(dataUpdatedAt) : null
}

/**
 * Hook for connection status
 */
export function useMetricsConnection() {
  const { isError, isLoading, isFetching } = useDashboardMetricsQuery()
  return {
    connected: !isError && !isLoading,
    loading: isLoading,
    fetching: isFetching,
    error: isError,
  }
}
