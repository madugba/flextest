import { ApiError } from '@/shared/api/client'
import { toast } from 'sonner'
import type { CandidateImportState } from '../useCandidateImportState'

export function createImportFromApi(
  state: CandidateImportState,
  onSuccess?: (count: number) => void
) {
  return async () => {
    const {
      selectedCenterId,
      selectedExamSessionId,
      visibleStudents,
      selectedSubjects,
      importMutation,
      handleClose,
      setError,
    } = state

    if (!selectedCenterId) {
      setError('Please select a center')
      return
    }
    if (!selectedExamSessionId) {
      setError('Please select an exam session')
      return
    }
    if (!visibleStudents.length) {
      setError('No students loaded yet')
      return
    }
    if (!selectedSubjects.length) {
      setError('Please select at least one subject')
      return
    }
    if (selectedSubjects.length > 4) {
      setError('Maximum 4 subjects allowed')
      return
    }

    try {
      setError(null)
      toast.loading(`Importing ${visibleStudents.length} candidate(s)...`, { id: 'import-loading' })
      const candidates = visibleStudents
        .map((s) => {
          const surname = s.surname?.trim() || ''
          const firstname = s.firstname?.trim() || ''
          if (!s.studentid?.trim() || !surname || !firstname) return null
          return {
            id: String(s.studentid.trim()),
            surname,
            firstname,
            ...(s.othername?.trim() && { othername: s.othername.trim() }),
            ...(s.picture?.trim() && { picture: s.picture.trim() }),
            sessionId: selectedExamSessionId,
            subjects: selectedSubjects,
          }
        })
        .filter((c): c is NonNullable<typeof c> => c !== null)
      const result = await importMutation.mutateAsync({ candidates })
      toast.dismiss('import-loading')
      handleClose()
      if (result.failed > 0) {
        toast.warning('Import completed with errors', {
          description: `Success: ${result.success}, Failed: ${result.failed}`,
        })
      } else {
        toast.success('Import completed', {
          description: `Successfully imported ${result.success} candidates`,
        })
      }
      onSuccess?.(result.success)
    } catch (err: unknown) {
      const msg = err instanceof ApiError ? err.message : err instanceof Error ? err.message : 'Failed to import'
      toast.dismiss('import-loading')
      setError(msg)
      toast.error('Import failed', { description: msg })
    }
  }
}
