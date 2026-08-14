import type { Dispatch, SetStateAction } from 'react'
import { toast } from 'sonner'
import { getAllAPIConfigurations, type APIConfiguration } from '@/entities/api-configuration'

export function createLoadConfigurations(
  setConfigurations: Dispatch<SetStateAction<APIConfiguration[]>>,
  setLoading: Dispatch<SetStateAction<boolean>>
) {
  return async () => {
    try {
      const data = await getAllAPIConfigurations()
      setConfigurations(data)
    } catch {
      toast.error('Failed to load API configurations')
    } finally {
      setLoading(false)
    }
  }
}
