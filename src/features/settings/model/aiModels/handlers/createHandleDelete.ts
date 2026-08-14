import { toast } from 'sonner'
import { deleteAIModel, type AIModelProvider } from '@/entities/ai-model'
import { getApiErrorMessage } from '../../shared/selectors/getApiErrorMessage'
import { getProviderDisplayName } from '../selectors/getProviderDisplayName'

export function createHandleDelete(reload: () => void) {
  return async (id: string, provider: AIModelProvider) => {
    if (!confirm(`Are you sure you want to delete the ${getProviderDisplayName(provider)} model?`)) {
      return
    }

    try {
      await deleteAIModel(id)
      toast.success('AI model deleted successfully')
      await reload()
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error) ?? 'Failed to delete AI model')
    }
  }
}
