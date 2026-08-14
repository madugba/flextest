import type { Dispatch, SetStateAction } from 'react'
import type { Center } from '@/entities/center'
import type { AIModelFormData } from '../../model/aiModels/types'
import { AIModelActiveToggle } from './AIModelActiveToggle'
import { AIModelApiKeyField } from './AIModelApiKeyField'
import { AIModelCenterField } from './AIModelCenterField'
import { AIModelDescriptionField } from './AIModelDescriptionField'
import { AIModelFormActions } from './AIModelFormActions'
import { AIModelNameField } from './AIModelNameField'
import { AIModelProviderField } from './AIModelProviderField'

interface AIModelFormProps {
  formData: AIModelFormData
  setFormData: Dispatch<SetStateAction<AIModelFormData>>
  centers: Center[]
  isCreating: boolean
  onSave: () => void
  onCancel: () => void
}

export function AIModelForm({
  formData,
  setFormData,
  centers,
  isCreating,
  onSave,
  onCancel,
}: AIModelFormProps) {
  return (
    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
      <h3 className="text-sm font-medium text-gray-900 mb-4">
        {isCreating ? 'Add New AI Model' : 'Edit AI Model'}
      </h3>
      <div className="space-y-4">
        <AIModelProviderField formData={formData} setFormData={setFormData} />

        <AIModelCenterField formData={formData} setFormData={setFormData} centers={centers} />

        <AIModelApiKeyField formData={formData} setFormData={setFormData} />

        <AIModelNameField formData={formData} setFormData={setFormData} />

        <AIModelDescriptionField formData={formData} setFormData={setFormData} />

        <AIModelActiveToggle formData={formData} setFormData={setFormData} />

        <AIModelFormActions
          formData={formData}
          isCreating={isCreating}
          onSave={onSave}
          onCancel={onCancel}
        />
      </div>
    </div>
  )
}
