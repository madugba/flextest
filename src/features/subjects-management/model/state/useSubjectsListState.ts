import { useCallback, useState } from 'react'
import type { Subject } from '@/entities/subject'
import { createFetchSubjects } from '../handlers/createFetchSubjects'

export function useSubjectsListState() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)

  const fetchSubjects = useCallback(
    (searchQuery?: string) => createFetchSubjects(setSubjects, setLoading)(searchQuery),
    [setSubjects, setLoading]
  )

  return { subjects, setSubjects, loading, setLoading, fetchSubjects }
}
