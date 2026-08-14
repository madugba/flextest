import type { PendingSubject } from '../types'
import { getSubjectName } from './getSubjectName'
import { isValidSubjectName } from './isValidSubjectName'

export function hasEmptySubjectNames(subjects: PendingSubject[]): boolean {
  return subjects.some((subject) => !isValidSubjectName(getSubjectName(subject)))
}
