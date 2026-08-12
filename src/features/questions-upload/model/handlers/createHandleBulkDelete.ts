import type { Dispatch, SetStateAction } from 'react'
import { toast } from 'sonner'
import { deleteQuestion, type Question } from '@/entities/question'

export interface HandleBulkDeleteDeps {
  selectedIds: Set<string>
  setIsBulkDeleting: Dispatch<SetStateAction<boolean>>
  setQuestions: Dispatch<SetStateAction<Question[]>>
  setSelectedIds: Dispatch<SetStateAction<Set<string>>>
  setBulkDeleteConfirmOpen: Dispatch<SetStateAction<boolean>>
}

export function createHandleBulkDelete(deps: HandleBulkDeleteDeps): () => Promise<void> {
  const { selectedIds, setIsBulkDeleting, setQuestions, setSelectedIds, setBulkDeleteConfirmOpen } =
    deps

  return async () => {
    if (selectedIds.size === 0) return
    setIsBulkDeleting(true)
    const ids = Array.from(selectedIds)
    const results = await Promise.allSettled(ids.map((id) => deleteQuestion(id)))
    const failed = results.filter((r) => r.status === 'rejected').length
    const succeeded = results.filter((r) => r.status === 'fulfilled').length
    const succeededIds = new Set(ids.filter((_, i) => results[i]!.status === 'fulfilled'))
    setQuestions((prev) => prev.filter((q) => !succeededIds.has(q.id)))
    setSelectedIds((prev) => {
      const next = new Set(prev)
      succeededIds.forEach((id) => next.delete(id))
      return next
    })
    setBulkDeleteConfirmOpen(false)
    setIsBulkDeleting(false)
    if (failed === 0) {
      toast.success(`${succeeded} question${succeeded !== 1 ? 's' : ''} deleted`)
    } else {
      toast.error(`${succeeded} deleted, ${failed} failed`)
    }
  }
}
