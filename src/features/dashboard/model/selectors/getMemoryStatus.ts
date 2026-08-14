import type { MetricStatus } from '../types'

export function getMemoryStatus(percentage: number | undefined): MetricStatus {
  const current = percentage ?? 0
  if (current > 90) return 'critical'
  if (current > 75) return 'warning'
  return 'healthy'
}
