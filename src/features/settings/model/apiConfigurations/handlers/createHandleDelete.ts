import { toast } from 'sonner'
import { useDeleteAPIConfigurationMutation } from '@/entities/api-configuration'
import { getApiErrorMessage } from '../../shared/selectors/getApiErrorMessage'

export function createHandleDelete(
  deleteMutation: ReturnType<typeof useDeleteAPIConfigurationMutation>
) {
  return async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
      return
    }

    try {
      await deleteMutation.mutateAsync(id)
      toast.success('API configuration deleted successfully')
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error) ?? 'Failed to delete API configuration')
    }
  }
}
