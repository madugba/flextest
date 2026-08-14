import type { useMonitoringView } from '../model/useMonitoringView'
import { CandidateDetailSheet } from './CandidateDetailSheet'
import { StartExamDialog } from './StartExamDialog'
import { PauseExamDialog } from './PauseExamDialog'
import { ResumeExamDialog } from './ResumeExamDialog'
import { EndExamDialog } from './EndExamDialog'
import { LogoutCandidateDialog } from './LogoutCandidateDialog'
import { BulkLogoutDialog } from './BulkLogoutDialog'

interface MonitoringDialogsProps {
  view: ReturnType<typeof useMonitoringView>
}

export function MonitoringDialogs({ view }: MonitoringDialogsProps) {
  return (
    <>
      <CandidateDetailSheet
        viewingCandidateId={view.viewingCandidateId}
        candidates={view.candidates}
        subjectQuestionCounts={view.subjectQuestionCounts}
        onClose={() => view.setViewingCandidateId(null)}
      />

      <StartExamDialog
        open={view.showStartConfirm}
        onOpenChange={view.setShowStartConfirm}
        duration={view.selectedSession?.duration ?? 0}
        isControlling={view.isControlling}
        onConfirm={view.confirmStartExam}
      />

      <PauseExamDialog
        open={view.showPauseConfirm}
        onOpenChange={view.setShowPauseConfirm}
        isControlling={view.isControlling}
        onConfirm={view.confirmPauseExam}
      />

      <ResumeExamDialog
        open={view.showResumeConfirm}
        onOpenChange={view.setShowResumeConfirm}
        isControlling={view.isControlling}
        onConfirm={view.confirmResumeExam}
      />

      <EndExamDialog
        open={view.showEndConfirm}
        onOpenChange={view.setShowEndConfirm}
        isControlling={view.isControlling}
        onConfirm={view.confirmEndExam}
      />

      <LogoutCandidateDialog
        open={view.showLogoutConfirm}
        onOpenChange={view.setShowLogoutConfirm}
        candidateName={view.selectedCandidateForLogout?.name ?? null}
        isPending={view.logoutPending}
        onConfirm={view.confirmLogoutCandidate}
      />

      <BulkLogoutDialog
        open={view.showBulkLogoutConfirm}
        onOpenChange={view.setShowBulkLogoutConfirm}
        selectedCandidates={view.selectedCandidates}
        candidates={view.filteredCandidates}
        isPending={view.bulkLogoutPending}
        onConfirm={view.confirmBulkLogout}
      />
    </>
  )
}
