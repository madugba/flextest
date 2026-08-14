import { toast } from 'sonner'
import { deleteAPIConfiguration } from '@/entities/api-configuration'
import { getApiErrorMessage } from '../../shared/selectors/getApiErrorMessage'

export function createHandleDelete(reload: () => void) {
  return async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
      return
    }

    try {
      await deleteAPIConfiguration(id)
      toast.success('API configuration deleted successfully')
      await reload()
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error) ?? 'Failed to delete API configuration')
    }
  }
}
