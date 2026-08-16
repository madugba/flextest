import type { Dispatch, SetStateAction } from 'react'
import { toast } from 'sonner'
import { type Question, useDeleteQuestionMutation } from '@/entities/question'

export interface HandleDeleteDeps {
  questionToDelete: Question | null
  deleteMutation: ReturnType<typeof useDeleteQuestionMutation>
  setSelectedIds: Dispatch<SetStateAction<Set<string>>>
  setDeleteDialogOpen: Dispatch<SetStateAction<boolean>>
  setQuestionToDelete: Dispatch<SetStateAction<Question | null>>
}

export function createHandleDelete(deps: HandleDeleteDeps): () => Promise<void> {
  const {
    questionToDelete,
    deleteMutation,
    setSelectedIds,
    setDeleteDialogOpen,
    setQuestionToDelete,
  } = deps

  return async () => {
    if (!questionToDelete) return

    try {
      await deleteMutation.mutateAsync(questionToDelete.id)

      setSelectedIds((prev) => {
        const next = new Set(prev)
        next.delete(questionToDelete.id)
        return next
      })
      toast.success('Question deleted successfully!')
      setDeleteDialogOpen(false)
      setQuestionToDelete(null)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete question'
      toast.error(errorMessage)
    }
  }
}
