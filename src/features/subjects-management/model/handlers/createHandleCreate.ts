import type { Dispatch, SetStateAction } from 'react'
import { toast } from 'sonner'
import { useCreateSubjectMutation } from '@/entities/subject'

interface CreateHandleCreateDeps {
  subjectName: string
  setSubjectName: Dispatch<SetStateAction<string>>
  setShowCreateDialog: Dispatch<SetStateAction<boolean>>
  setSearch: Dispatch<SetStateAction<string>>
  createMutation: ReturnType<typeof useCreateSubjectMutation>
}

export function createHandleCreate(deps: CreateHandleCreateDeps) {
  return async () => {
    const { subjectName, setSubjectName, setShowCreateDialog, setSearch, createMutation } = deps

    if (!subjectName.trim()) {
      toast.error('Subject name is required')
      return
    }

    try {
      await createMutation.mutateAsync({ name: subjectName.trim() })
      toast.success('Subject created successfully', {
        description: 'The subject has been created successfully',
      })
      setShowCreateDialog(false)
      setSubjectName('')
      setSearch('')
    } catch (error) {
      toast.error('Failed to create subject', {
        description: error instanceof Error ? error.message : 'An error occurred',
      })
    }
  }
}
