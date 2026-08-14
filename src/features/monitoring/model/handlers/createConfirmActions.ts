import type { Dispatch, SetStateAction } from 'react'
import type { SessionControlRequest } from '@/entities/monitoring'

type StateSetter = (value: boolean) => void
type CandidateForLogoutSetter = (value: { id: string; name: string } | null) => void

interface CreateConfirmActionsArgs {
  controlSession: (request: SessionControlRequest) => void
  logoutMutate: (
    variables: { candidateId: string; reason: string },
    options?: { onSuccess?: () => void }
  ) => void
  bulkLogoutMutate: (
    variables: { candidateIds: string[]; reason: string },
    options?: { onSuccess?: () => void }
  ) => void
  selectedCandidateForLogout: { id: string; name: string } | null
  selectedCandidates: Set<string>
  setShowStartConfirm: StateSetter
  setShowPauseConfirm: StateSetter
  setShowResumeConfirm: StateSetter
  setShowEndConfirm: StateSetter
  setShowLogoutConfirm: StateSetter
  setShowBulkLogoutConfirm: StateSetter
  setSelectedCandidateForLogout: CandidateForLogoutSetter
  setSelectedCandidates: Dispatch<SetStateAction<Set<string>>>
}

export function createConfirmActions({
  controlSession,
  logoutMutate,
  bulkLogoutMutate,
  selectedCandidateForLogout,
  selectedCandidates,
  setShowStartConfirm,
  setShowPauseConfirm,
  setShowResumeConfirm,
  setShowEndConfirm,
  setShowLogoutConfirm,
  setShowBulkLogoutConfirm,
  setSelectedCandidateForLogout,
  setSelectedCandidates,
}: CreateConfirmActionsArgs) {
  const confirmStartExam = () => {
    controlSession({ action: 'start' })
    setShowStartConfirm(false)
  }
  const confirmPauseExam = () => {
    controlSession({ action: 'pause' })
    setShowPauseConfirm(false)
  }
  const confirmResumeExam = () => {
    controlSession({ action: 'resume' })
    setShowResumeConfirm(false)
  }
  const confirmEndExam = () => {
    controlSession({ action: 'end' })
    setShowEndConfirm(false)
  }

  const confirmLogoutCandidate = () => {
    if (!selectedCandidateForLogout) return

    logoutMutate(
      { candidateId: selectedCandidateForLogout.id, reason: 'Forced logout by administrator' },
      {
        onSuccess: () => {
          setShowLogoutConfirm(false)
          setSelectedCandidateForLogout(null)
        },
      }
    )
  }

  const confirmBulkLogout = () => {
    const candidateIds = Array.from(selectedCandidates)

    bulkLogoutMutate(
      { candidateIds, reason: 'Bulk logout by administrator' },
      {
        onSuccess: () => {
          setShowBulkLogoutConfirm(false)
          setSelectedCandidates(new Set())
        },
      }
    )
  }

  return {
    confirmStartExam,
    confirmPauseExam,
    confirmResumeExam,
    confirmEndExam,
    confirmLogoutCandidate,
    confirmBulkLogout,
  }
}
