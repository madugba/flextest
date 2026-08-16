import type { Dispatch, SetStateAction } from 'react'
import { toast } from 'sonner'
import { useDeleteExamSessionMutation, type ExamSession } from '@/entities/exam-session'

interface DeleteHandlerDeps {
  selectedSession: ExamSession | null
  deleteMutation: ReturnType<typeof useDeleteExamSessionMutation>
  setShowDeleteDialog: Dispatch<SetStateAction<boolean>>
  setSelectedSession: Dispatch<SetStateAction<ExamSession | null>>
}

export function createDeleteHandler(deps: DeleteHandlerDeps) {
  const { selectedSession, deleteMutation, setShowDeleteDialog, setSelectedSession } = deps

  return async () => {
    if (!selectedSession) return

    try {
      await deleteMutation.mutateAsync(selectedSession.id)
      toast.success('Exam session deleted successfully')
      setShowDeleteDialog(false)
      setSelectedSession(null)
    } catch (error) {
      toast.error('Failed to delete exam session', {
        description: error instanceof Error ? error.message : 'An error occurred',
      })
    }
  }
}
