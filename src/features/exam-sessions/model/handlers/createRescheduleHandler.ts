import type { Dispatch, SetStateAction } from 'react'
import { toast } from 'sonner'
import { useRescheduleExamSessionMutation, type ExamSession } from '@/entities/exam-session'

interface RescheduleHandlerDeps {
  selectedSession: ExamSession | null
  confirmSessionName: string
  rescheduleMutation: ReturnType<typeof useRescheduleExamSessionMutation>
  setShowRescheduleDialog: Dispatch<SetStateAction<boolean>>
  setSelectedSession: Dispatch<SetStateAction<ExamSession | null>>
  setConfirmSessionName: Dispatch<SetStateAction<string>>
}

export function createRescheduleHandler(deps: RescheduleHandlerDeps) {
  const {
    selectedSession,
    confirmSessionName,
    rescheduleMutation,
    setShowRescheduleDialog,
    setSelectedSession,
    setConfirmSessionName,
  } = deps

  return async () => {
    if (!selectedSession) return

    // Validate confirmation
    if (confirmSessionName !== selectedSession.name) {
      toast.error('Session name does not match')
      return
    }

    try {
      await rescheduleMutation.mutateAsync(selectedSession.id)
      toast.success('Exam session rescheduled successfully', {
        description: 'All candidate progress and answers have been cleared',
      })
      setShowRescheduleDialog(false)
      setSelectedSession(null)
      setConfirmSessionName('')
    } catch (error) {
      toast.error('Failed to reschedule exam session', {
        description: error instanceof Error ? error.message : 'An error occurred',
      })
    }
  }
}
