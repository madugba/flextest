interface CreateDialogOpenersArgs {
  selectedSession: { status?: string } | null
  setShowStartConfirm: (value: boolean) => void
  setShowPauseConfirm: (value: boolean) => void
  setShowResumeConfirm: (value: boolean) => void
  setShowEndConfirm: (value: boolean) => void
  setShowLogoutConfirm: (value: boolean) => void
  setSelectedCandidateForLogout: (value: { id: string; name: string } | null) => void
}

export function createDialogOpeners({
  selectedSession,
  setShowStartConfirm,
  setShowPauseConfirm,
  setShowResumeConfirm,
  setShowEndConfirm,
  setShowLogoutConfirm,
  setSelectedCandidateForLogout,
}: CreateDialogOpenersArgs) {
  const handleStartExam = () => {
    if (!selectedSession) return
    setShowStartConfirm(true)
  }

  const handlePauseExam = () => {
    if (!selectedSession) return
    setShowPauseConfirm(true)
  }

  const handleResumeExam = () => {
    if (!selectedSession) return
    setShowResumeConfirm(true)
  }

  const handleEndExam = () => {
    if (!selectedSession) return
    setShowEndConfirm(true)
  }

  const handleLogoutCandidate = (candidateId: string, candidateName: string) => {
    setSelectedCandidateForLogout({ id: candidateId, name: candidateName })
    setShowLogoutConfirm(true)
  }

  return {
    handleStartExam,
    handlePauseExam,
    handleResumeExam,
    handleEndExam,
    handleLogoutCandidate,
  }
}
