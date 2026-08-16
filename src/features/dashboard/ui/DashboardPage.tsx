'use client'

import { DashboardHeader } from '@/widgets/dashboard'
import { useDashboardPage } from '../model/useDashboardPage'
import { BusinessMetricsSection } from './BusinessMetricsSection'
import { DashboardErrorState } from './DashboardErrorState'
import { DashboardGreeting } from './DashboardGreeting'
import { DashboardLoadingState } from './DashboardLoadingState'
import { InfrastructureSection } from './InfrastructureSection'
import { PerformanceSection } from './PerformanceSection'
import { SystemHealthSection } from './SystemHealthSection'

export function DashboardPage() {
  const { user, authLoading, metrics, isLoading, isError, error, lastUpdate, connected } =
    useDashboardPage()

  if (authLoading || isLoading) {
    return <DashboardLoadingState label="Loading dashboard..." />
  }

  if (!user) {
    return null
  }

  if (isError) {
    return (
      <DashboardErrorState
        message={error instanceof Error ? error.message : 'Failed to load dashboard metrics'}
      />
    )
  }

  if (!metrics) {
    return <DashboardLoadingState label="Loading metrics data..." />
  }

  return (
    <>
      <DashboardHeader
        serverStatus={metrics?.system?.server?.status || 'unknown'}
        lastUpdate={lastUpdate}
        connected={connected}
      />

      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <DashboardGreeting firstName={user.firstName} />
          <SystemHealthSection system={metrics?.system} connections={metrics?.connections} />
          <BusinessMetricsSection business={metrics?.business} />
          <InfrastructureSection connections={metrics?.connections} system={metrics?.system} />
          <PerformanceSection performance={metrics?.performance} />
        </div>
      </main>
    </>
  )
}
