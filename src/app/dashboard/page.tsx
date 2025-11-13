'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/shared/contexts/AuthContext'
import { Spinner } from '@/shared/ui/Spinner'
import { DashboardHeader, MetricCard } from '@/widgets/dashboard'
import {
  useDashboardMetrics,
  useLastUpdate,
  useMetricsConnection,
  useMetricsStream,
} from '@/features/metrics'
import { formatBytes, formatUptime } from '@/entities/metrics'
import type { SystemMetrics, BusinessMetrics, ConnectionMetrics, PerformanceMetrics } from '@/entities/metrics/api/metricsApi'

export default function DashboardPage() {
  const { user, loading: authLoading, isAuthenticated } = useAuth()
  const router = useRouter()

  useMetricsStream()

  const { data: metrics, isLoading, isError, error } = useDashboardMetrics()
  const lastUpdate = useLastUpdate()
  const { connected } = useMetricsConnection()

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [authLoading, isAuthenticated, router])

  if (authLoading || isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <Spinner />
          <p className="mt-4 text-sm text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (isError) {
    return (
      <>
        <DashboardHeader serverStatus="unknown" lastUpdate={null} connected={false} />
        <main className="flex-1 overflow-auto p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-red-800 font-medium">Error loading metrics</p>
            <p className="text-red-600 text-sm mt-1">
              {error instanceof Error ? error.message : 'Failed to load dashboard metrics'}
            </p>
          </div>
        </main>
      </>
    )
  }

  if (!metrics) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <Spinner />
          <p className="mt-4 text-sm text-gray-600">Loading metrics data...</p>
        </div>
      </div>
    )
  }

  const system = metrics?.system
  const connections = metrics?.connections
  const business = metrics?.business
  const performance = metrics?.performance

  return (
    <>
      <DashboardHeader
        serverStatus={system?.server?.status || 'unknown'}
        lastUpdate={lastUpdate}
        connected={connected}
      />

      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-8">
          <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Welcome back, {user.firstName}!
              </h2>
              <p className="text-gray-600 mt-1">
                Monitor your system in real-time
              </p>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <MetricCard
              title="Server Status"
              value={system?.server?.status?.toUpperCase() || 'UNKNOWN'}
              subtitle={system?.server?.uptime ? formatUptime(system.server.uptime) : ''}
              status={
                system?.server?.status === 'healthy'
                  ? 'healthy'
                  : system?.server?.status === 'degraded'
                  ? 'warning'
                  : 'critical'
              }
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
              status={
                (system?.cpu?.usage || 0) > 85
                  ? 'critical'
                  : (system?.cpu?.usage || 0) > 70
                  ? 'warning'
                  : 'healthy'
              }
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
              status={
                (system?.memory?.percentage || 0) > 90
                  ? 'critical'
                  : (system?.memory?.percentage || 0) > 75
                  ? 'warning'
                  : 'healthy'
              }
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
              status={
                (business?.security?.failedLogins || 0) > 10
                  ? 'critical'
                  : (business?.security?.failedLogins || 0) > 5
                  ? 'warning'
                  : 'healthy'
              }
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

          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <MetricCard
              title="Avg Response Time"
              value={`${performance?.responseTime?.average || 0}ms`}
              subtitle="P50"
              status={
                (performance?.responseTime?.average || 0) > 500
                  ? 'critical'
                  : (performance?.responseTime?.average || 0) > 200
                  ? 'warning'
                  : 'healthy'
              }
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
              status={
                (performance?.errorRate?.percentage || 0) > 5
                  ? 'critical'
                  : (performance?.errorRate?.percentage || 0) > 1
                  ? 'warning'
                  : 'healthy'
              }
            />
          </section>
        </div>
      </main>
    </>
  )
}

const SystemHealthSection = React.memo(({ system, connections }: {
  system: SystemMetrics | undefined
  connections: ConnectionMetrics | undefined
}) => (
  <section>
    <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title="Server Status"
        value={system?.server?.status?.toUpperCase() || 'UNKNOWN'}
        subtitle={system?.server?.uptime ? formatUptime(system.server.uptime) : ''}
        status={
          system?.server?.status === 'healthy'
            ? 'healthy'
            : system?.server?.status === 'degraded'
            ? 'warning'
            : 'critical'
        }
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
        status={
          (system?.cpu?.usage || 0) > 85
            ? 'critical'
            : (system?.cpu?.usage || 0) > 70
            ? 'warning'
            : 'healthy'
        }
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
        status={
          (system?.memory?.percentage || 0) > 90
            ? 'critical'
            : (system?.memory?.percentage || 0) > 75
            ? 'warning'
            : 'healthy'
        }
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
        title="Active Clients"
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
    </div>
  </section>
))

const BusinessMetricsSection = React.memo(({ business }: { business: BusinessMetrics | undefined }) => (
  <section>
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Metrics</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
        status={
          (business?.security?.failedLogins || 0) > 10
            ? 'critical'
            : (business?.security?.failedLogins || 0) > 5
            ? 'warning'
            : 'healthy'
        }
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
    </div>
  </section>
))

const InfrastructureSection = React.memo(({ connections, system }: {
  connections: ConnectionMetrics | undefined
  system: SystemMetrics | undefined
}) => (
  <section>
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Infrastructure</h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
    </div>
  </section>
))

const PerformanceSection = React.memo(({ performance }: { performance: PerformanceMetrics | undefined }) => (
  <section>
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance</h3>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <MetricCard
        title="Avg Response Time"
        value={`${performance?.responseTime?.average || 0}ms`}
        subtitle="P50"
        status={
          (performance?.responseTime?.average || 0) > 500
            ? 'critical'
            : (performance?.responseTime?.average || 0) > 200
            ? 'warning'
            : 'healthy'
        }
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
        status={
          (performance?.errorRate?.percentage || 0) > 5
            ? 'critical'
            : (performance?.errorRate?.percentage || 0) > 1
            ? 'warning'
            : 'healthy'
        }
      />
    </div>
  </section>
))

SystemHealthSection.displayName = 'SystemHealthSection'
BusinessMetricsSection.displayName = 'BusinessMetricsSection'
InfrastructureSection.displayName = 'InfrastructureSection'
PerformanceSection.displayName = 'PerformanceSection'
