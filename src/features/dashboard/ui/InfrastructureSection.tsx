import type { ConnectionMetrics, SystemMetrics } from '@/entities/metrics'
import { MetricCard } from '@/widgets/dashboard'

interface InfrastructureSectionProps {
  connections: ConnectionMetrics | undefined
  system: SystemMetrics | undefined
}

export function InfrastructureSection({ connections, system }: InfrastructureSectionProps) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      <MetricCard
        title="Database Connections"
        value={`${connections?.database?.active || 0}/${connections?.database?.max || 0}`}
        subtitle={`${connections?.database?.idle || 0} idle`}
        status="neutral"
      />

      <MetricCard
        title="Redis Status"
        value={connections?.redis?.connected ? 'Connected' : 'Disconnected'}
        subtitle={connections?.redis?.connected ? 'Healthy' : 'Check connection'}
        status={connections?.redis?.connected ? 'healthy' : 'critical'}
      />

      <MetricCard
        title="Requests/Second"
        value={system?.requests?.perSecond?.toFixed(2) || '0.00'}
        subtitle={`${system?.requests?.total || 0} total`}
        status="neutral"
      />
    </section>
  )
}
