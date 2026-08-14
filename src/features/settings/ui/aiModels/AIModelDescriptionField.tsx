import type { Dispatch, SetStateAction } from 'react'
import type { AIModelFormData } from '../../model/aiModels/types'

interface AIModelDescriptionFieldProps {
  formData: AIModelFormData
  setFormData: Dispatch<SetStateAction<AIModelFormData>>
}

export function AIModelDescriptionField({ formData, setFormData }: AIModelDescriptionFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Description (Optional)
      </label>
      <textarea
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        placeholder="Optional notes about this model configuration"
        rows={2}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  )
}
