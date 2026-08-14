import type { Dispatch, SetStateAction } from 'react'

interface CreateHandleToggleSubjectDeps {
  setSelectedSubjects: Dispatch<SetStateAction<string[]>>
}

export function createHandleToggleSubject({ setSelectedSubjects }: CreateHandleToggleSubjectDeps) {
  return (subjectId: string) => {
    setSelectedSubjects(prev => {
      if (prev.includes(subjectId)) {
        return prev.filter(id => id !== subjectId)
      } else if (prev.length < 6) {
        return [...prev, subjectId]
      }
      return prev
    })
  }
}
