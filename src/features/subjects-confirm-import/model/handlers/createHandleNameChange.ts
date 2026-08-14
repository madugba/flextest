import type { Dispatch, SetStateAction } from 'react'
import type { PendingSubject } from '../types'
import { writePendingImport } from '../storage'

interface CreateHandleNameChangeDeps {
  setSubjects: Dispatch<SetStateAction<PendingSubject[]>>
}

export function createHandleNameChange(deps: CreateHandleNameChangeDeps) {
  const { setSubjects } = deps

  return (index: number, newName: string) => {
    setSubjects((prev) => {
      const updated = prev.map((subject, i) =>
        i === index ? { ...subject, subjectname: newName } : subject
      )
      writePendingImport(updated)
      return updated
    })
  }
}
