import type { Dispatch, SetStateAction } from 'react'
import { toast } from 'sonner'
import { deleteQuestion, type Question } from '@/entities/question'

export interface HandleDeleteDeps {
  questionToDelete: Question | null
  questions: Question[]
  setIsSaving: Dispatch<SetStateAction<boolean>>
  setError: Dispatch<SetStateAction<string | null>>
  setQuestions: Dispatch<SetStateAction<Question[]>>
  setSelectedIds: Dispatch<SetStateAction<Set<string>>>
  setDeleteDialogOpen: Dispatch<SetStateAction<boolean>>
  setQuestionToDelete: Dispatch<SetStateAction<Question | null>>
}

export function createHandleDelete(deps: HandleDeleteDeps): () => Promise<void> {
  const {
    questionToDelete,
    questions,
    setIsSaving,
    setError,
    setQuestions,
    setSelectedIds,
    setDeleteDialogOpen,
    setQuestionToDelete,
  } = deps

  return async () => {
    if (!questionToDelete) {
      console.log('[handleDelete] No question to delete')
      return
    }

    try {
      setIsSaving(true)
      setError(null)

      console.log('[handleDelete] Starting delete for question:', questionToDelete.id)
      console.log('[handleDelete] Current questions count:', questions.length)
      console.log('[handleDelete] Questions IDs:', questions.map((q) => q.id))

      await deleteQuestion(questionToDelete.id)
      console.log('[handleDelete] Delete API call completed successfully')

      setQuestions((prev) => prev.filter((q) => q.id !== questionToDelete.id))
      setSelectedIds((prev) => {
        const next = new Set(prev)
        next.delete(questionToDelete.id)
        return next
      })
      toast.success('Question deleted successfully!')
      setDeleteDialogOpen(false)
      setQuestionToDelete(null)
    } catch (err: unknown) {
      console.error('[handleDelete] Error occurred:', err)
      const errObj = typeof err === 'object' && err !== null ? err : {}
      console.error('[handleDelete] Error type:', errObj.constructor?.name)
      console.error('[handleDelete] Error message:', err instanceof Error ? err.message : undefined)
      console.error(
        '[handleDelete] Error statusCode:',
        'statusCode' in errObj ? (errObj as { statusCode?: unknown }).statusCode : undefined
      )
      console.error(
        '[handleDelete] Error code:',
        'code' in errObj ? (errObj as { code?: unknown }).code : undefined
      )

      const message = err instanceof Error ? err.message : undefined
      const responseMessage = 'response' in errObj
        ? (errObj as { response?: { data?: { message?: string } } }).response?.data?.message
        : undefined
      const errorMessage = message || responseMessage || 'Failed to delete question'
      toast.error(errorMessage)
      setError(errorMessage)
    } finally {
      setIsSaving(false)
    }
  }
}
