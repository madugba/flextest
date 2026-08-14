import type { Dispatch, SetStateAction } from 'react'
import type { APIConfiguration } from '@/entities/api-configuration'
import type { APIConfigurationFormData } from '../types'

export function createHandleEdit(
  setEditingId: Dispatch<SetStateAction<string | null>>,
  setFormData: Dispatch<SetStateAction<APIConfigurationFormData>>
) {
  return (config: APIConfiguration) => {
    setEditingId(config.id)
    setFormData({
      name: config.name,
      apiEndpoint: config.apiEndpoint,
      apiKey: config.apiKey || '',
      description: config.description || '',
      centerId: config.centerId,
      isSchoolPortal: config.isSchoolPortal,
    })
  }
}
