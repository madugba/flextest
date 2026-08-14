import type { Dispatch, SetStateAction } from 'react'
import type { AIModelFormData } from '../../model/aiModels/types'

interface AIModelNameFieldProps {
  formData: AIModelFormData
  setFormData: Dispatch<SetStateAction<AIModelFormData>>
}

export function AIModelNameField({ formData, setFormData }: AIModelNameFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Model Name (Optional)</label>
      <input
        type="text"
        value={formData.modelName}
        onChange={(e) => setFormData({ ...formData, modelName: e.target.value })}
        placeholder="e.g., gpt-4, gemini-pro, deepseek-chat"
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  )
}
