import type { Dispatch, SetStateAction } from 'react'
import { toast } from 'sonner'
import { createSubject } from '@/entities/subject'

interface CreateHandleCreateDeps {
  subjectName: string
  setSubjectName: Dispatch<SetStateAction<string>>
  setShowCreateDialog: Dispatch<SetStateAction<boolean>>
  setSearch: Dispatch<SetStateAction<string>>
  setIsSubmitting: Dispatch<SetStateAction<boolean>>
  fetchSubjects: (searchQuery?: string) => Promise<void>
}

export function createHandleCreate(deps: CreateHandleCreateDeps) {
  return async () => {
    const {
      subjectName,
      setSubjectName,
      setShowCreateDialog,
      setSearch,
      setIsSubmitting,
      fetchSubjects,
    } = deps

    if (!subjectName.trim()) {
      toast.error('Subject name is required')
      return
    }

    try {
      setIsSubmitting(true)
      await createSubject({ name: subjectName.trim() })
      toast.success('Subject created successfully', {
        description: 'The subject has been created successfully',
      })
      setShowCreateDialog(false)
      setSubjectName('')
      setSearch('')
      await fetchSubjects('')
    } catch (error) {
      toast.error('Failed to create subject', {
        description: error instanceof Error ? error.message : 'An error occurred',
      })
    } finally {
      setIsSubmitting(false)
    }
  }
}
