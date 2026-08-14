import type { BusinessMetrics } from '@/entities/metrics'
import { MetricCard } from '@/widgets/dashboard'
import { getFailedLoginsStatus } from '../model/selectors'

interface BusinessMetricsSectionProps {
  business: BusinessMetrics | undefined
}

export function BusinessMetricsSection({ business }: BusinessMetricsSectionProps) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      <MetricCard
        title="Total Centers"
        value={business?.centers?.total || 0}
        subtitle={`${business?.centers?.active || 0} active`}
        status="neutral"
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
        }
      />

      <MetricCard
        title="Total Admins"
        value={business?.admins?.total || 0}
        subtitle={`${business?.admins?.active || 0} active today`}
        status="neutral"
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        }
      />

      <MetricCard
        title="Active Sessions"
        value={business?.sessions?.active || 0}
        subtitle="Live sessions"
        status="neutral"
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
            />
          </svg>
        }
      />

      <MetricCard
        title="Failed Logins"
        value={business?.security?.failedLogins || 0}
        subtitle="Last hour"
        status={getFailedLoginsStatus(business?.security?.failedLogins)}
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        }
      />
    </section>
  )
}
