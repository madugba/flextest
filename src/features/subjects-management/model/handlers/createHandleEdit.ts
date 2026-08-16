import type { Dispatch, SetStateAction } from 'react'
import { toast } from 'sonner'
import { type Subject, useUpdateSubjectMutation } from '@/entities/subject'

interface CreateHandleEditDeps {
  selectedSubject: Subject | null
  subjectName: string
  setSubjectName: Dispatch<SetStateAction<string>>
  setShowEditDialog: Dispatch<SetStateAction<boolean>>
  setSelectedSubject: Dispatch<SetStateAction<Subject | null>>
  updateMutation: ReturnType<typeof useUpdateSubjectMutation>
}

export function createHandleEdit(deps: CreateHandleEditDeps) {
  return async () => {
    const {
      selectedSubject,
      subjectName,
      setSubjectName,
      setShowEditDialog,
      setSelectedSubject,
      updateMutation,
    } = deps

    if (!selectedSubject || !subjectName.trim()) return

    try {
      await updateMutation.mutateAsync({
        id: selectedSubject.id,
        data: { name: subjectName.trim() },
      })
      toast.success('Subject updated successfully')
      setShowEditDialog(false)
      setSelectedSubject(null)
      setSubjectName('')
    } catch (error) {
      toast.error('Failed to update subject', {
        description: error instanceof Error ? error.message : 'An error occurred',
      })
    }
  }
}
