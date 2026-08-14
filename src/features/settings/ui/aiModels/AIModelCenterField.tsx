import type { Dispatch, SetStateAction } from 'react'
import type { Center } from '@/entities/center'
import type { AIModelFormData } from '../../model/aiModels/types'

interface AIModelCenterFieldProps {
  formData: AIModelFormData
  setFormData: Dispatch<SetStateAction<AIModelFormData>>
  centers: Center[]
}

export function AIModelCenterField({ formData, setFormData, centers }: AIModelCenterFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Center <span className="text-red-500">*</span>
      </label>
      <select
        value={formData.centerId}
        onChange={(e) => setFormData({ ...formData, centerId: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Select center for AI model"
        title="Select center for AI model"
      >
        <option value="">Select center...</option>
        {centers.map((center) => (
          <option key={center.id} value={center.id}>
            {center.centerName}
          </option>
        ))}
      </select>
    </div>
  )
}
