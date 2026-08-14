import type { PendingSubject } from '../types'
import { getSubjectName } from './getSubjectName'

export interface SubjectRow {
  subject: PendingSubject
  originalIndex: number
}

export function getFilteredSubjectRows(subjects: PendingSubject[], query: string): SubjectRow[] {
  const rows = subjects.map((subject, originalIndex) => ({ subject, originalIndex }))

  const trimmedQuery = query.trim()
  if (!trimmedQuery) return rows

  const lowerQuery = trimmedQuery.toLowerCase()
  return rows.filter(({ subject }) => getSubjectName(subject).toLowerCase().includes(lowerQuery))
}
