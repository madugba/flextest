import type { PendingSubject } from '../types'
import { getSubjectName } from './getSubjectName'
import { isValidSubjectName } from './isValidSubjectName'

export function getValidSubjectsCount(subjects: PendingSubject[]): number {
  return subjects.filter((subject) => isValidSubjectName(getSubjectName(subject))).length
}
