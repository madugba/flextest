import type { ConnectionMetrics, SystemMetrics } from '@/entities/metrics'
import { formatBytes, formatUptime } from '@/entities/metrics'
import { MetricCard } from '@/widgets/dashboard'
import { getCpuStatus, getMemoryStatus, getServerStatus } from '../model/selectors'

interface SystemHealthSectionProps {
  system: SystemMetrics | undefined
  connections: ConnectionMetrics | undefined
}

export function SystemHealthSection({ system, connections }: SystemHealthSectionProps) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      <MetricCard
        title="Server Status"
        value={system?.server?.status?.toUpperCase() || 'UNKNOWN'}
        subtitle={system?.server?.uptime ? formatUptime(system.server.uptime) : ''}
        status={getServerStatus(system?.server?.status)}
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
            />
          </svg>
        }
      />

      <MetricCard
        title="CPU Usage"
        value={`${system?.cpu?.usage?.toFixed(1) || 0}%`}
        subtitle={`Avg: ${system?.cpu?.average?.toFixed(1) || 0}%`}
        status={getCpuStatus(system?.cpu?.usage)}
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
            />
          </svg>
        }
      />

      <MetricCard
        title="Memory"
        value={formatBytes(system?.memory?.used || 0)}
        subtitle={`${system?.memory?.percentage?.toFixed(1) || 0}% of ${formatBytes(system?.memory?.total || 0)}`}
        status={getMemoryStatus(system?.memory?.percentage)}
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        }
      />

      <MetricCard
        title="Connected Clients"
        value={connections?.clients?.active || 0}
        subtitle={`Peak: ${connections?.clients?.peak || 0}`}
        status="neutral"
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        }
      />
    </section>
  )
}
