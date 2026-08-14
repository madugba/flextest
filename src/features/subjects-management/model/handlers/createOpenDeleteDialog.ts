import type { Dispatch, SetStateAction } from 'react'
import type { Subject } from '@/entities/subject'

interface CreateOpenDeleteDialogDeps {
  setSelectedSubject: Dispatch<SetStateAction<Subject | null>>
  setShowDeleteDialog: Dispatch<SetStateAction<boolean>>
}

export function createOpenDeleteDialog(deps: CreateOpenDeleteDialogDeps) {
  return (subject: Subject) => {
    deps.setSelectedSubject(subject)
    deps.setShowDeleteDialog(true)
  }
}
