import type { Dispatch, SetStateAction } from 'react'
import { toast } from 'sonner'
import { updateSubject, type Subject } from '@/entities/subject'

interface CreateHandleEditDeps {
  selectedSubject: Subject | null
  subjectName: string
  search: string
  setSubjectName: Dispatch<SetStateAction<string>>
  setShowEditDialog: Dispatch<SetStateAction<boolean>>
  setSelectedSubject: Dispatch<SetStateAction<Subject | null>>
  setIsSubmitting: Dispatch<SetStateAction<boolean>>
  fetchSubjects: (searchQuery?: string) => Promise<void>
}

export function createHandleEdit(deps: CreateHandleEditDeps) {
  return async () => {
    const {
      selectedSubject,
      subjectName,
      search,
      setSubjectName,
      setShowEditDialog,
      setSelectedSubject,
      setIsSubmitting,
      fetchSubjects,
    } = deps

    if (!selectedSubject || !subjectName.trim()) return

    try {
      setIsSubmitting(true)
      await updateSubject(selectedSubject.id, { name: subjectName.trim() })
      toast.success('Subject updated successfully')
      setShowEditDialog(false)
      setSelectedSubject(null)
      setSubjectName('')
      await fetchSubjects(search)
    } catch (error) {
      toast.error('Failed to update subject', {
        description: error instanceof Error ? error.message : 'An error occurred',
      })
    } finally {
      setIsSubmitting(false)
    }
  }
}
