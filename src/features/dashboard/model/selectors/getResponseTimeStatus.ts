import type { MetricStatus } from '../types'

export function getResponseTimeStatus(average: number | undefined): MetricStatus {
  const current = average ?? 0
  if (current > 500) return 'critical'
  if (current > 200) return 'warning'
  return 'healthy'
}
