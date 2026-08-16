import { toast } from 'sonner'
import { useDeleteScoreConfigurationMutation } from '@/entities/score-configuration'
import { getErrorMessage } from '../../shared/selectors/getErrorMessage'

export function createHandleDelete(
  deleteMutation: ReturnType<typeof useDeleteScoreConfigurationMutation>
) {
  return async (id: string) => {
    if (!confirm('Are you sure you want to delete this configuration?')) {
      return
    }

    try {
      await deleteMutation.mutateAsync(id)
      toast.success('Score configuration deleted successfully')
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, 'Failed to delete score configuration'))
    }
  }
}
