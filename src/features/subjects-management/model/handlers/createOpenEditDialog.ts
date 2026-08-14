import type { Dispatch, SetStateAction } from 'react'
import type { Subject } from '@/entities/subject'

interface CreateOpenEditDialogDeps {
  setSelectedSubject: Dispatch<SetStateAction<Subject | null>>
  setSubjectName: Dispatch<SetStateAction<string>>
  setShowEditDialog: Dispatch<SetStateAction<boolean>>
}

export function createOpenEditDialog(deps: CreateOpenEditDialogDeps) {
  return (subject: Subject) => {
    deps.setSelectedSubject(subject)
    deps.setSubjectName(subject.name)
    deps.setShowEditDialog(true)
  }
}
