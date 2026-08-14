import type { Dispatch, SetStateAction } from 'react'
import type { APIConfigurationFormData } from '../../model/apiConfigurations/types'

interface APIConfigurationApiKeyFieldProps {
  formData: APIConfigurationFormData
  setFormData: Dispatch<SetStateAction<APIConfigurationFormData>>
}

export function APIConfigurationApiKeyField({
  formData,
  setFormData,
}: APIConfigurationApiKeyFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        API Key (Optional)
      </label>
      <input
        type="password"
        value={formData.apiKey}
        onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
        placeholder="Optional API key for authentication"
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  )
}
