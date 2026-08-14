import type { Dispatch, SetStateAction } from 'react'
import { toast } from 'sonner'
import type { PendingSubject } from '../types'
import { readPendingImport } from '../storage'
import { normalizePendingSubjects } from '../selectors/normalizePendingSubjects'

interface RedirectRouter {
  push: (href: string) => void
}

interface CreateLoadPendingImportDeps {
  router: RedirectRouter
  setSubjects: Dispatch<SetStateAction<PendingSubject[]>>
  setIsLoading: Dispatch<SetStateAction<boolean>>
}

export function createLoadPendingImport(deps: CreateLoadPendingImportDeps) {
  const { router, setSubjects, setIsLoading } = deps

  return () => {
    try {
      const pending = readPendingImport()

      if (pending === null) {
        toast.error('No pending import found')
        router.push('/dashboard/subjects')
        return
      }

      const subjectsArray = Array.isArray(pending) ? pending : [pending]
      const normalized = normalizePendingSubjects(subjectsArray)

      if (normalized.length === 0) {
        toast.error('No valid subjects found in import data')
        router.push('/dashboard/subjects')
        return
      }

      setSubjects(normalized)
    } catch {
      toast.error('Invalid import data format')
      router.push('/dashboard/subjects')
    } finally {
      setIsLoading(false)
    }
  }
}
