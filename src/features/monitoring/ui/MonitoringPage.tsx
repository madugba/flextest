'use client'

import { Suspense } from 'react'
import { Loader2 } from 'lucide-react'
import { DashboardHeader } from '@/widgets/dashboard/ui/DashboardHeader'
import { useMonitoringView } from '../model/useMonitoringView'
import { MonitoringHeader } from './MonitoringHeader'
import { MonitoringStatsGrid } from './MonitoringStatsGrid'
import { MonitoringToolbar } from './MonitoringToolbar'
import { CandidatesTable } from './CandidatesTable'
import { CandidateDetailSheet } from './CandidateDetailSheet'
import { StartExamDialog } from './StartExamDialog'
import { PauseExamDialog } from './PauseExamDialog'
import { ResumeExamDialog } from './ResumeExamDialog'
import { EndExamDialog } from './EndExamDialog'
import { LogoutCandidateDialog } from './LogoutCandidateDialog'
import { BulkLogoutDialog } from './BulkLogoutDialog'

function MonitoringContent() {
  const {
    sessionId,
    selectedSession,
    stats,
    candidates,
    displayCandidates,
    filteredCandidates,
    isLoading,
    error,
    controlError,
    isControlling,
    elapsedHms,
    connectedClients,
    isSubscribed,
    subjectQuestionCounts,
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    isAutoRefresh,
    setIsAutoRefresh,
    selectedCandidates,
    isAllSelected,
    isIndeterminate,
    handleSelectAll,
    handleSelectCandidate,
    viewingCandidateId,
    setViewingCandidateId,
    showStartConfirm,
    setShowStartConfirm,
    showPauseConfirm,
    setShowPauseConfirm,
    showResumeConfirm,
    setShowResumeConfirm,
    showEndConfirm,
    setShowEndConfirm,
    showLogoutConfirm,
    setShowLogoutConfirm,
    selectedCandidateForLogout,
    showBulkLogoutConfirm,
    setShowBulkLogoutConfirm,
    handleStartExam,
    handlePauseExam,
    handleResumeExam,
    handleEndExam,
    confirmStartExam,
    confirmPauseExam,
    confirmResumeExam,
    confirmEndExam,
    handleLogoutCandidate,
    confirmLogoutCandidate,
    confirmBulkLogout,
    canStart,
    canPause,
    canResume,
    canEnd,
    logoutPending,
    bulkLogoutPending,
  } = useMonitoringView()

  return (
    <div className="flex-1 overflow-auto">
      <DashboardHeader />

      <div className="p-6 space-y-6">
        {/* Exam Session Header */}
        <MonitoringHeader
          isAutoRefresh={isAutoRefresh}
          isControlling={isControlling}
          canStart={canStart}
          canPause={canPause}
          canResume={canResume}
          canEnd={canEnd}
          onToggleAutoRefresh={() => setIsAutoRefresh(!isAutoRefresh)}
          onStart={handleStartExam}
          onPause={handlePauseExam}
          onResume={handleResumeExam}
          onEnd={handleEndExam}
        />

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p className="font-medium">Error loading monitoring data</p>
            <p className="text-sm">{error instanceof Error ? error.message : 'Unknown error'}</p>
          </div>
        )}

        {controlError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p className="font-medium">Error controlling session</p>
            <p className="text-sm">{controlError instanceof Error ? controlError.message : 'Unknown error'}</p>
          </div>
        )}

        {isLoading && !selectedSession && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {!isLoading && !sessionId && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
            <p className="font-medium">No session ID provided</p>
            <p className="text-sm">Please provide a session ID in the URL query parameter: ?session=SESSION_ID</p>
          </div>
        )}

        {!isLoading && sessionId && !selectedSession && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p className="font-medium">Session not found</p>
            <p className="text-sm">The session with ID &quot;{sessionId}&quot; could not be found</p>
          </div>
        )}

        {selectedSession && (
          <>
            <MonitoringStatsGrid
              elapsedHms={elapsedHms}
              stats={stats}
              isSubscribed={isSubscribed}
              connectedClients={connectedClients}
            />

            <MonitoringToolbar
              selectedCount={selectedCandidates.size}
              onBulkLogout={() => {
                if (selectedCandidates.size > 0) {
                  setShowBulkLogoutConfirm(true)
                }
              }}
              filterStatus={filterStatus}
              onFilterChange={setFilterStatus}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />

            <CandidatesTable
              candidates={displayCandidates}
              filteredCandidates={filteredCandidates}
              selectedCandidates={selectedCandidates}
              isAllSelected={isAllSelected}
              isIndeterminate={isIndeterminate}
              onSelectAll={handleSelectAll}
              onSelectCandidate={handleSelectCandidate}
              onViewCandidate={setViewingCandidateId}
              onLogoutCandidate={handleLogoutCandidate}
            />
          </>
        )}
      </div>

      {/* ── Candidate Detail Sheet ── */}
      <CandidateDetailSheet
        viewingCandidateId={viewingCandidateId}
        candidates={candidates}
        subjectQuestionCounts={subjectQuestionCounts}
        onClose={() => setViewingCandidateId(null)}
      />

      <StartExamDialog
        open={showStartConfirm}
        onOpenChange={setShowStartConfirm}
        duration={selectedSession?.duration ?? 0}
        isControlling={isControlling}
        onConfirm={confirmStartExam}
      />

      <PauseExamDialog
        open={showPauseConfirm}
        onOpenChange={setShowPauseConfirm}
        isControlling={isControlling}
        onConfirm={confirmPauseExam}
      />

      <ResumeExamDialog
        open={showResumeConfirm}
        onOpenChange={setShowResumeConfirm}
        isControlling={isControlling}
        onConfirm={confirmResumeExam}
      />

      <EndExamDialog
        open={showEndConfirm}
        onOpenChange={setShowEndConfirm}
        isControlling={isControlling}
        onConfirm={confirmEndExam}
      />

      <LogoutCandidateDialog
        open={showLogoutConfirm}
        onOpenChange={setShowLogoutConfirm}
        candidateName={selectedCandidateForLogout?.name ?? null}
        isPending={logoutPending}
        onConfirm={confirmLogoutCandidate}
      />

      <BulkLogoutDialog
        open={showBulkLogoutConfirm}
        onOpenChange={setShowBulkLogoutConfirm}
        selectedCandidates={selectedCandidates}
        candidates={filteredCandidates}
        isPending={bulkLogoutPending}
        onConfirm={confirmBulkLogout}
      />
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
