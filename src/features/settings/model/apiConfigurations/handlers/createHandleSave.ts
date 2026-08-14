import type { Dispatch, SetStateAction } from 'react'
import { toast } from 'sonner'
import {
  createAPIConfiguration,
  updateAPIConfiguration,
  type CreateAPIConfigurationRequest,
  type UpdateAPIConfigurationRequest,
} from '@/entities/api-configuration'
import { getApiErrorMessage } from '../../shared/selectors/getApiErrorMessage'
import { EMPTY_API_CONFIGURATION_FORM, type APIConfigurationFormData } from '../types'

interface CreateHandleSaveDeps {
  formData: APIConfigurationFormData
  isCreating: boolean
  editingId: string | null
  setIsCreating: Dispatch<SetStateAction<boolean>>
  setEditingId: Dispatch<SetStateAction<string | null>>
  setFormData: Dispatch<SetStateAction<APIConfigurationFormData>>
  reload: () => void
}

export function createHandleSave({
  formData,
  isCreating,
  editingId,
  setIsCreating,
  setEditingId,
  setFormData,
  reload,
}: CreateHandleSaveDeps) {
  return async () => {
    try {
      if (!formData.name.trim() || !formData.apiEndpoint.trim() || !formData.centerId) {
        toast.error('Name, API endpoint, and center are required')
        return
      }

      if (isCreating) {
        const newConfig: CreateAPIConfigurationRequest = {
          name: formData.name.trim(),
          apiEndpoint: formData.apiEndpoint.trim(),
          apiKey: formData.apiKey.trim() || undefined,
          description: formData.description.trim() || undefined,
          centerId: formData.centerId,
          isSchoolPortal: formData.isSchoolPortal,
        }
        await createAPIConfiguration(newConfig)
        toast.success('API configuration created successfully')
      } else if (editingId) {
        const updateData: UpdateAPIConfigurationRequest = {
          name: formData.name.trim(),
          apiEndpoint: formData.apiEndpoint.trim(),
          apiKey: formData.apiKey.trim() || undefined,
          description: formData.description.trim() || undefined,
          centerId: formData.centerId,
          isSchoolPortal: formData.isSchoolPortal,
        }
        await updateAPIConfiguration(editingId, updateData)
        toast.success('API configuration updated successfully')
      }

      setIsCreating(false)
      setEditingId(null)
      setFormData({ ...EMPTY_API_CONFIGURATION_FORM })
      await reload()
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error) ?? 'Failed to save API configuration')
    }
  }
}
