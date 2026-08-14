import type { PendingSubject } from '../types'

export function normalizePendingSubjects(items: unknown[]): PendingSubject[] {
  return items
    .filter((item) => item !== null && item !== undefined)
    .map((item): PendingSubject => {
      if (typeof item === 'string') {
        return { subjectname: item }
      }

      if (typeof item === 'object' && item !== null) {
        const record = item as Record<string, unknown>
        const subjectid =
          typeof record.subjectid === 'string'
            ? record.subjectid
            : typeof record.id === 'string'
              ? record.id
              : undefined
        const subjectname =
          typeof record.subjectname === 'string'
            ? record.subjectname
            : typeof record.name === 'string'
              ? record.name
              : typeof record.subject === 'string'
                ? record.subject
                : ''

        return { subjectid, subjectname }
      }

      return { subjectname: '' }
    })
}
