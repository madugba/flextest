import { toast } from 'sonner'
import { useDeleteAIModelMutation, type AIModelProvider } from '@/entities/ai-model'
import { getApiErrorMessage } from '../../shared/selectors/getApiErrorMessage'
import { getProviderDisplayName } from '../selectors/getProviderDisplayName'

export function createHandleDelete(
  deleteMutation: ReturnType<typeof useDeleteAIModelMutation>
) {
  return async (id: string, provider: AIModelProvider) => {
    if (!confirm(`Are you sure you want to delete the ${getProviderDisplayName(provider)} model?`)) {
      return
    }

    try {
      await deleteMutation.mutateAsync(id)
      toast.success('AI model deleted successfully')
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error) ?? 'Failed to delete AI model')
    }
  }
}
