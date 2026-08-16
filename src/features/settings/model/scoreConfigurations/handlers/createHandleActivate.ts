import { toast } from 'sonner'
import { useActivateScoreConfigurationMutation } from '@/entities/score-configuration'
import { getErrorMessage } from '../../shared/selectors/getErrorMessage'

export function createHandleActivate(
  activateMutation: ReturnType<typeof useActivateScoreConfigurationMutation>
) {
  return async (id: string) => {
    try {
      await activateMutation.mutateAsync(id)
      toast.success('Score configuration activated successfully')
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, 'Failed to activate score configuration'))
    }
  }
}
