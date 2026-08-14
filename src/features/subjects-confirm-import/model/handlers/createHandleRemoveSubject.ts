import type { Dispatch, SetStateAction } from 'react'
import { toast } from 'sonner'
import type { PendingSubject } from '../types'
import { writePendingImport } from '../storage'

interface CreateHandleRemoveSubjectDeps {
  setSubjects: Dispatch<SetStateAction<PendingSubject[]>>
}

export function createHandleRemoveSubject(deps: CreateHandleRemoveSubjectDeps) {
  const { setSubjects } = deps

  return (index: number) => {
    setSubjects((prev) => {
      const updated = prev.filter((_, i) => i !== index)
      writePendingImport(updated)
      return updated
    })
    toast.success('Subject removed from import list')
  }
}
