import type { Dispatch, SetStateAction } from 'react'
import type { AIModelFormData } from '../../model/aiModels/types'

interface AIModelActiveToggleProps {
  formData: AIModelFormData
  setFormData: Dispatch<SetStateAction<AIModelFormData>>
}

export function AIModelActiveToggle({ formData, setFormData }: AIModelActiveToggleProps) {
  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        id="isActive"
        checked={formData.isActive}
        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
      />
      <label htmlFor="isActive" className="ml-2 text-sm font-medium text-gray-700">
        Active (Enable this model for use)
      </label>
    </div>
  )
}
