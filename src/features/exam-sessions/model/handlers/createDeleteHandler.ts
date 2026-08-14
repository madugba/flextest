import type { Dispatch, SetStateAction } from 'react'
import { toast } from 'sonner'
import { deleteExamSession, type ExamSession } from '@/entities/exam-session'

interface DeleteHandlerDeps {
  selectedSession: ExamSession | null
  setIsSubmitting: Dispatch<SetStateAction<boolean>>
  setShowDeleteDialog: Dispatch<SetStateAction<boolean>>
  setSelectedSession: Dispatch<SetStateAction<ExamSession | null>>
  fetchExamSessions: () => Promise<void>
}

export function createDeleteHandler(deps: DeleteHandlerDeps) {
  const { selectedSession, setIsSubmitting, setShowDeleteDialog, setSelectedSession, fetchExamSessions } =
    deps

  return async () => {
    if (!selectedSession) return

    try {
      setIsSubmitting(true)
      await deleteExamSession(selectedSession.id)
      toast.success('Exam session deleted successfully')
      setShowDeleteDialog(false)
      setSelectedSession(null)
      await fetchExamSessions()
    } catch (error) {
      toast.error('Failed to delete exam session', {
        description: error instanceof Error ? error.message : 'An error occurred',
      })
    } finally {
      setIsSubmitting(false)
    }
  }
}
