import type { MetricStatus } from '../types'

export function getFailedLoginsStatus(count: number | undefined): MetricStatus {
  const current = count ?? 0
  if (current > 10) return 'critical'
  if (current > 5) return 'warning'
  return 'healthy'
}
