import type { Dispatch, SetStateAction } from 'react'
import type { APIConfigurationFormData } from '../../model/apiConfigurations/types'

interface APIConfigurationDescriptionFieldProps {
  formData: APIConfigurationFormData
  setFormData: Dispatch<SetStateAction<APIConfigurationFormData>>
}

export function APIConfigurationDescriptionField({
  formData,
  setFormData,
}: APIConfigurationDescriptionFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Description (Optional)
      </label>
      <textarea
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        placeholder="Optional description of this API configuration"
        rows={2}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  )
}
