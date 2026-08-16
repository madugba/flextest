import { toast } from 'sonner'
import { useConfirmImportSubjectsMutation } from '@/entities/subject'
import type { PendingSubject } from '../types'
import { clearPendingImport } from '../storage'
import { getValidSubjects } from '../selectors/getValidSubjects'

interface RedirectRouter {
  push: (href: string) => void
}

interface CreateHandleConfirmImportDeps {
  subjects: PendingSubject[]
  router: RedirectRouter
  confirmMutation: ReturnType<typeof useConfirmImportSubjectsMutation>
}

export function createHandleConfirmImport(deps: CreateHandleConfirmImportDeps) {
  const { subjects, router, confirmMutation } = deps

  return async () => {
    const validSubjects = getValidSubjects(subjects)

    if (validSubjects.length === 0) {
      toast.error('Please provide at least one valid subject name')
      return
    }

    if (validSubjects.length < subjects.length) {
      const emptyCount = subjects.length - validSubjects.length
      toast.warning(`${emptyCount} subject(s) with empty names will be skipped`)
    }

    try {
      const result = await confirmMutation.mutateAsync({ subjects: validSubjects })

      clearPendingImport()

      toast.success(`Import complete: ${result.created} created, ${result.skipped} skipped`)

      if (result.errors.length > 0) {
        result.errors.forEach((error) => toast.error(error))
      }

      router.push('/dashboard/subjects')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to import subjects')
    }
  }
}
