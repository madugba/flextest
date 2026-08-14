import type { Dispatch, SetStateAction } from 'react'
import { toast } from 'sonner'
import { activateScoreConfiguration } from '@/entities/score-configuration'
import { getErrorMessage } from '../../shared/selectors/getErrorMessage'

export function createHandleActivate(
  setIsActivatingScore: Dispatch<SetStateAction<boolean>>,
  reload: () => void
) {
  return async (id: string) => {
    setIsActivatingScore(true)

    try {
      await activateScoreConfiguration(id)
      toast.success('Score configuration activated successfully')
      await reload()
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, 'Failed to activate score configuration'))
    } finally {
      setIsActivatingScore(false)
    }
  }
}
