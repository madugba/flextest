import type { Dispatch, SetStateAction } from 'react'
import type { APIConfigurationFormData } from '../../model/apiConfigurations/types'

interface APIConfigurationNameFieldProps {
  formData: APIConfigurationFormData
  setFormData: Dispatch<SetStateAction<APIConfigurationFormData>>
}

export function APIConfigurationNameField({
  formData,
  setFormData,
}: APIConfigurationNameFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Configuration Name <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="e.g., Production API, Test API"
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <p className="mt-1 text-xs text-gray-500">
        This name will be shown when selecting a configuration during import
      </p>
    </div>
  )
}
