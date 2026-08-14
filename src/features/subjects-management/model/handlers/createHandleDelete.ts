import type { Dispatch, SetStateAction } from 'react'
import { toast } from 'sonner'
import { deleteSubject, type Subject } from '@/entities/subject'

interface CreateHandleDeleteDeps {
  selectedSubject: Subject | null
  search: string
  setShowDeleteDialog: Dispatch<SetStateAction<boolean>>
  setSelectedSubject: Dispatch<SetStateAction<Subject | null>>
  setIsSubmitting: Dispatch<SetStateAction<boolean>>
  fetchSubjects: (searchQuery?: string) => Promise<void>
}

export function createHandleDelete(deps: CreateHandleDeleteDeps) {
  return async () => {
    const {
      selectedSubject,
      search,
      setShowDeleteDialog,
      setSelectedSubject,
      setIsSubmitting,
      fetchSubjects,
    } = deps

    if (!selectedSubject) return

    try {
      setIsSubmitting(true)
      await deleteSubject(selectedSubject.id)
      toast.success('Subject deleted successfully')
      setShowDeleteDialog(false)
      setSelectedSubject(null)
      await fetchSubjects(search)
    } catch (error) {
      toast.error('Failed to delete subject', {
        description: error instanceof Error ? error.message : 'An error occurred',
      })
    } finally {
      setIsSubmitting(false)
    }
  }
}
