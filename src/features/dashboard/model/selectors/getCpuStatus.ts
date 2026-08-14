import type { MetricStatus } from '../types'

export function getCpuStatus(usage: number | undefined): MetricStatus {
  const current = usage ?? 0
  if (current > 85) return 'critical'
  if (current > 70) return 'warning'
  return 'healthy'
}
