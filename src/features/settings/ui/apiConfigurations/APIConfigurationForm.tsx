import type { Dispatch, SetStateAction } from 'react'
import type { Center } from '@/entities/center'
import type { APIConfigurationFormData } from '../../model/apiConfigurations/types'
import { APIConfigurationApiKeyField } from './APIConfigurationApiKeyField'
import { APIConfigurationCenterField } from './APIConfigurationCenterField'
import { APIConfigurationDescriptionField } from './APIConfigurationDescriptionField'
import { APIConfigurationEndpointField } from './APIConfigurationEndpointField'
import { APIConfigurationFormActions } from './APIConfigurationFormActions'
import { APIConfigurationNameField } from './APIConfigurationNameField'
import { APIConfigurationSchoolPortalToggle } from './APIConfigurationSchoolPortalToggle'

interface APIConfigurationFormProps {
  formData: APIConfigurationFormData
  setFormData: Dispatch<SetStateAction<APIConfigurationFormData>>
  centers: Center[]
  isCreating: boolean
  onSave: () => void
  onCancel: () => void
}

export function APIConfigurationForm({
  formData,
  setFormData,
  centers,
  isCreating,
  onSave,
  onCancel,
}: APIConfigurationFormProps) {
  return (
    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
      <h3 className="text-sm font-medium text-gray-900 mb-4">
        {isCreating ? 'Create New Configuration' : 'Edit Configuration'}
      </h3>
      <div className="space-y-4">
        <APIConfigurationCenterField
          formData={formData}
          setFormData={setFormData}
          centers={centers}
        />

        <APIConfigurationNameField formData={formData} setFormData={setFormData} />

        <APIConfigurationEndpointField formData={formData} setFormData={setFormData} />

        <APIConfigurationApiKeyField formData={formData} setFormData={setFormData} />

        <APIConfigurationDescriptionField formData={formData} setFormData={setFormData} />

        <APIConfigurationSchoolPortalToggle formData={formData} setFormData={setFormData} />

        <APIConfigurationFormActions
          formData={formData}
          isCreating={isCreating}
          onSave={onSave}
          onCancel={onCancel}
        />
      </div>
    </div>
  )
}
