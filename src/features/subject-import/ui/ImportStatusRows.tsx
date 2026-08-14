'use client'

import { Loader2, CheckCircle2 } from 'lucide-react'

interface ImportStatusRowsProps {
  isLoadingSubjects: boolean
  subjects: Array<{ subjectid?: string; subjectname: string }>
  subjectsError: string | null
}

export function ImportStatusRows({ isLoadingSubjects, subjects, subjectsError }: ImportStatusRowsProps) {
  return (
    <>
      {isLoadingSubjects && (
        <div className="flex items-center gap-2 text-sm text-gray-600 py-1">
          <Loader2 className="h-4 w-4 animate-spin" />
          Fetching subjects from API…
        </div>
      )}

      {!isLoadingSubjects && subjects.length > 0 && (
        <div className="flex items-center gap-3 p-4 border rounded-lg bg-green-50 border-green-200">
          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
          <p className="text-sm font-medium text-green-800">
            <span className="text-lg font-bold">{subjects.length}</span>{' '}
            subject{subjects.length !== 1 ? 's' : ''} found — ready to import
          </p>
        </div>
      )}

      {subjectsError && (
        <div className="p-4 border border-destructive rounded-lg bg-destructive/10">
          <p className="text-sm text-destructive">{subjectsError}</p>
        </div>
      )}
    </>
  )
}
