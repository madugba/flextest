'use client'

import { Suspense } from 'react'
import { Loader2 } from 'lucide-react'
import { DashboardHeader } from '@/widgets/dashboard/ui/DashboardHeader'
import { useMonitoringView } from '../model/useMonitoringView'
import { MonitoringHeader } from './MonitoringHeader'
import { MonitoringAlerts } from './MonitoringAlerts'
import { MonitoringStatsGrid } from './MonitoringStatsGrid'
import { MonitoringToolbar } from './MonitoringToolbar'
import { CandidatesTable } from './CandidatesTable'
import { MonitoringDialogs } from './MonitoringDialogs'

function MonitoringContent() {
  const view = useMonitoringView()

  return (
    <div className="flex-1 overflow-auto">
      <DashboardHeader />

      <div className="p-6 space-y-6">
        <MonitoringHeader
          isAutoRefresh={view.isAutoRefresh}
          isControlling={view.isControlling}
          canStart={view.canStart}
          canPause={view.canPause}
          canResume={view.canResume}
          canEnd={view.canEnd}
          onToggleAutoRefresh={() => view.setIsAutoRefresh(!view.isAutoRefresh)}
          onStart={view.handleStartExam}
          onPause={view.handlePauseExam}
          onResume={view.handleResumeExam}
          onEnd={view.handleEndExam}
        />

        <MonitoringAlerts
          error={view.error}
          controlError={view.controlError}
          isLoading={view.isLoading}
          sessionId={view.sessionId}
          selectedSession={view.selectedSession}
        />

        {view.selectedSession && (
          <>
            <MonitoringStatsGrid
              elapsedHms={view.elapsedHms}
              stats={view.stats}
              isSubscribed={view.isSubscribed}
              connectedClients={view.connectedClients}
            />

            <MonitoringToolbar
              selectedCount={view.selectedCandidates.size}
              onBulkLogout={() => view.selectedCandidates.size > 0 && view.setShowBulkLogoutConfirm(true)}
              filterStatus={view.filterStatus}
              onFilterChange={view.setFilterStatus}
              searchQuery={view.searchQuery}
              onSearchChange={view.setSearchQuery}
            />

            <CandidatesTable
              candidates={view.displayCandidates}
              filteredCandidates={view.filteredCandidates}
              selectedCandidates={view.selectedCandidates}
              isAllSelected={view.isAllSelected}
              isIndeterminate={view.isIndeterminate}
              onSelectAll={view.handleSelectAll}
              onSelectCandidate={view.handleSelectCandidate}
              onViewCandidate={view.setViewingCandidateId}
              onLogoutCandidate={view.handleLogoutCandidate}
            />
          </>
        )}
      </div>

      <MonitoringDialogs view={view} />
    </div>
  )
}

export function MonitoringPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 overflow-auto">
          <DashboardHeader />
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      }
    >
      <MonitoringContent />
    </Suspense>
  )
}
