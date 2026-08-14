import type { SystemMetrics } from '@/entities/metrics'
import type { MetricStatus } from '../types'

export function getServerStatus(status: SystemMetrics['server']['status'] | undefined): MetricStatus {
  if (status === 'healthy') return 'healthy'
  if (status === 'degraded') return 'warning'
  return 'critical'
}
