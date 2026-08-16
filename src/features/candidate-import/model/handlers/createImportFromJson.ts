import { ApiError } from '@/shared/api/client'
import { toast } from 'sonner'
import type { CandidateImportState } from '../useCandidateImportState'

export function createImportFromJson(
  state: CandidateImportState,
  onSuccess?: (count: number) => void
) {
  return async () => {
    const { jsonData, setError, handleClose, importMutation } = state
    try {
      setError(null)
      let candidates
      try {
        candidates = JSON.parse(jsonData)
      } catch {
        throw new Error('Invalid JSON format')
      }
      if (!Array.isArray(candidates)) throw new Error('JSON must be an array of candidates')
      toast.loading(`Importing ${candidates.length} candidate(s)...`, { id: 'import-loading' })
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
