import type { Dispatch, SetStateAction } from 'react'
import type { AIModelFormData } from '../../model/aiModels/types'

interface AIModelApiKeyFieldProps {
  formData: AIModelFormData
  setFormData: Dispatch<SetStateAction<AIModelFormData>>
}

export function AIModelApiKeyField({ formData, setFormData }: AIModelApiKeyFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        API Key <span className="text-red-500">*</span>
      </label>
      <input
        type="password"
        value={formData.apiKey}
        onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
        placeholder="Enter your API key"
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <p className="mt-1 text-xs text-gray-500">
        Your API key will be encrypted and stored securely
      </p>
    </div>
  )
}
