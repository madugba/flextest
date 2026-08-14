import type { Dispatch, SetStateAction } from 'react'
import { toast } from 'sonner'
import { rescheduleExamSession, type ExamSession } from '@/entities/exam-session'

interface RescheduleHandlerDeps {
  selectedSession: ExamSession | null
  confirmSessionName: string
  setIsSubmitting: Dispatch<SetStateAction<boolean>>
  setShowRescheduleDialog: Dispatch<SetStateAction<boolean>>
  setSelectedSession: Dispatch<SetStateAction<ExamSession | null>>
  setConfirmSessionName: Dispatch<SetStateAction<string>>
  fetchExamSessions: () => Promise<void>
}

export function createRescheduleHandler(deps: RescheduleHandlerDeps) {
  const {
    selectedSession,
    confirmSessionName,
    setIsSubmitting,
    setShowRescheduleDialog,
    setSelectedSession,
    setConfirmSessionName,
    fetchExamSessions,
  } = deps

  return async () => {
    if (!selectedSession) return

    // Validate confirmation
    if (confirmSessionName !== selectedSession.name) {
      toast.error('Session name does not match')
      return
    }

    try {
      setIsSubmitting(true)
      await rescheduleExamSession(selectedSession.id)
      toast.success('Exam session rescheduled successfully', {
        description: 'All candidate progress and answers have been cleared',
      })
      setShowRescheduleDialog(false)
      setSelectedSession(null)
      setConfirmSessionName('')
      await fetchExamSessions()
    } catch (error) {
      toast.error('Failed to reschedule exam session', {
        description: error instanceof Error ? error.message : 'An error occurred',
      })
    } finally {
      setIsSubmitting(false)
    }
  }
}
