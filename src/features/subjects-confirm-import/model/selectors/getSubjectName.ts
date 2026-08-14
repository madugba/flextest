import type { PendingSubject } from '../types'

export function getSubjectName(subject: PendingSubject | undefined): string {
  return subject?.subjectname ?? subject?.name ?? ''
}
