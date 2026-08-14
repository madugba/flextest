import type { Dispatch, SetStateAction } from 'react'
import type { APIConfigurationFormData } from '../../model/apiConfigurations/types'

interface APIConfigurationEndpointFieldProps {
  formData: APIConfigurationFormData
  setFormData: Dispatch<SetStateAction<APIConfigurationFormData>>
}

export function APIConfigurationEndpointField({
  formData,
  setFormData,
}: APIConfigurationEndpointFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        API Endpoint <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        value={formData.apiEndpoint}
        onChange={(e) => setFormData({ ...formData, apiEndpoint: e.target.value })}
        placeholder="https://api.example.com/"
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  )
}
