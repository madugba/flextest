import type { Dispatch, SetStateAction } from 'react'
import { toast } from 'sonner'
import { type Subject, useDeleteSubjectMutation } from '@/entities/subject'

interface CreateHandleDeleteDeps {
  selectedSubject: Subject | null
  setShowDeleteDialog: Dispatch<SetStateAction<boolean>>
  setSelectedSubject: Dispatch<SetStateAction<Subject | null>>
  deleteMutation: ReturnType<typeof useDeleteSubjectMutation>
}

export function createHandleDelete(deps: CreateHandleDeleteDeps) {
  return async () => {
    const { selectedSubject, setShowDeleteDialog, setSelectedSubject, deleteMutation } = deps

    if (!selectedSubject) return

    try {
      await deleteMutation.mutateAsync(selectedSubject.id)
      toast.success('Subject deleted successfully')
      setShowDeleteDialog(false)
      setSelectedSubject(null)
    } catch (error) {
      toast.error('Failed to delete subject', {
        description: error instanceof Error ? error.message : 'An error occurred',
      })
    }
  }
}
