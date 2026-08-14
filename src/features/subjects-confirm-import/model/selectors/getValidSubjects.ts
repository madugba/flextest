import type { PendingSubject } from '../types'
import { getSubjectName } from './getSubjectName'
import { isValidSubjectName } from './isValidSubjectName'

export interface ValidSubject {
  subjectid?: string
  subjectname: string
  name: string
}

export function getValidSubjects(subjects: PendingSubject[]): ValidSubject[] {
  return subjects
    .filter((subject) => isValidSubjectName(getSubjectName(subject)))
    .map((subject) => {
      const trimmedName = getSubjectName(subject).trim()
      return {
        subjectid: subject.subjectid,
        subjectname: trimmedName,
        name: trimmedName,
      }
    })
}
