import type { Dispatch, SetStateAction } from 'react'
import { toast } from 'sonner'
import { deleteScoreConfiguration } from '@/entities/score-configuration'
import { getErrorMessage } from '../../shared/selectors/getErrorMessage'

export function createHandleDelete(
  setIsDeletingScore: Dispatch<SetStateAction<boolean>>,
  reload: () => void
) {
  return async (id: string) => {
    if (!confirm('Are you sure you want to delete this configuration?')) {
      return
    }

    setIsDeletingScore(true)

    try {
      await deleteScoreConfiguration(id)
      toast.success('Score configuration deleted successfully')
      await reload()
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, 'Failed to delete score configuration'))
    } finally {
      setIsDeletingScore(false)
    }
  }
}
