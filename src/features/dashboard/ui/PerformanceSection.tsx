import type { PerformanceMetrics } from '@/entities/metrics'
import { MetricCard } from '@/widgets/dashboard'
import { getErrorRateStatus, getResponseTimeStatus } from '../model/selectors'

interface PerformanceSectionProps {
  performance: PerformanceMetrics | undefined
}

export function PerformanceSection({ performance }: PerformanceSectionProps) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      <MetricCard
        title="Avg Response Time"
        value={`${performance?.responseTime?.average || 0}ms`}
        subtitle="P50"
        status={getResponseTimeStatus(performance?.responseTime?.average)}
      />

      <MetricCard
        title="P95 Response Time"
        value={`${performance?.responseTime?.p95 || 0}ms`}
        subtitle="95th percentile"
        status="neutral"
      />

      <MetricCard
        title="P99 Response Time"
        value={`${performance?.responseTime?.p99 || 0}ms`}
        subtitle="99th percentile"
        status="neutral"
      />

      <MetricCard
        title="Error Rate"
        value={`${performance?.errorRate?.percentage?.toFixed(2) || 0}%`}
        subtitle={`${performance?.errorRate?.count || 0} errors`}
        status={getErrorRateStatus(performance?.errorRate?.percentage)}
      />
    </section>
  )
}
