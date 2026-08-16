import { ApiError } from '@/shared/api/client'
import { toast } from 'sonner'
import type { CandidateImportState } from '../useCandidateImportState'

export function createImportFromExcel(
  state: CandidateImportState,
  onSuccess?: (count: number) => void
) {
  return async () => {
    const {
      excelFile,
      parsedExcelCandidates,
      selectedExamSessionId,
      selectedSubjects,
      importMutation,
      handleClose,
      setError,
    } = state

    if (!excelFile || !parsedExcelCandidates.length) {
      setError('Please select a valid Excel file')
      return
    }
    if (!selectedExamSessionId) {
      setError('Please select an exam session')
      return
    }
    if (!selectedSubjects.length) {
      setError('Please select at least one subject')
      return
    }

    try {
      setError(null)
      toast.loading(`Importing ${parsedExcelCandidates.length} candidate(s)...`, {
        id: 'import-loading',
      })
      const candidates = parsedExcelCandidates
        .map((c) => {
          const surname = c.lastName?.trim() || ''
          const firstname = c.firstName?.trim() || ''
          if (!surname || !firstname) return null
          return {
            ...(c.candidateid?.trim() && { id: c.candidateid.trim() }),
            surname,
            firstname,
            ...(c.otherName?.trim() && { othername: c.otherName.trim() }),
            sessionId: selectedExamSessionId,
            subjects: selectedSubjects,
          }
        })
        .filter((c): c is NonNullable<typeof c> => c !== null)
      if (!candidates.length) throw new Error('No valid candidates to import')
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
