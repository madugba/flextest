import type { Dispatch, SetStateAction } from 'react'
import type { APIConfiguration } from '@/entities/api-configuration'

export interface APIConfigurationFormData {
  name: string
  apiEndpoint: string
  apiKey: string
  description: string
  centerId: string
  isSchoolPortal: boolean
}

export const EMPTY_API_CONFIGURATION_FORM: APIConfigurationFormData = {
  name: '',
  apiEndpoint: '',
  apiKey: '',
  description: '',
  centerId: '',
  isSchoolPortal: false,
}

export interface APIConfigurationsController {
  configurations: APIConfiguration[]
  formData: APIConfigurationFormData
  setFormData: Dispatch<SetStateAction<APIConfigurationFormData>>
  editingId: string | null
  isCreating: boolean
  handleCreate: () => void
  handleEdit: (config: APIConfiguration) => void
  handleSave: () => void
  handleCancel: () => void
  handleDelete: (id: string, name: string) => void
  reload: () => void
}
