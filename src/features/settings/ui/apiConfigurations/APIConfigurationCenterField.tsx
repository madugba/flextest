import type { Dispatch, SetStateAction } from 'react'
import type { Center } from '@/entities/center'
import type { APIConfigurationFormData } from '../../model/apiConfigurations/types'

interface APIConfigurationCenterFieldProps {
  formData: APIConfigurationFormData
  setFormData: Dispatch<SetStateAction<APIConfigurationFormData>>
  centers: Center[]
}

export function APIConfigurationCenterField({
  formData,
  setFormData,
  centers,
}: APIConfigurationCenterFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Center <span className="text-red-500">*</span>
      </label>
      <select
        value={formData.centerId}
        onChange={(e) => setFormData({ ...formData, centerId: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Select center"
        title="Select center"
      >
        <option value="">Select a center...</option>
        {centers.map((center) => (
          <option key={center.id} value={center.id}>
            {center.centerName} - {center.state}
          </option>
        ))}
      </select>
      <p className="mt-1 text-xs text-gray-500">
        Multiple API configs can be added for each center
      </p>
    </div>
  )
}
