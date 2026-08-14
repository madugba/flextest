import type { MetricStatus } from '../types'

export function getErrorRateStatus(percentage: number | undefined): MetricStatus {
  const current = percentage ?? 0
  if (current > 5) return 'critical'
  if (current > 1) return 'warning'
  return 'healthy'
}
