import type { Dispatch, SetStateAction } from 'react'
import type { AIModelProvider } from '@/entities/ai-model'
import type { Center } from '@/entities/center'
import type { AIModelFormData } from '../../model/aiModels/types'

interface AIModelFormProps {
  formData: AIModelFormData
  setFormData: Dispatch<SetStateAction<AIModelFormData>>
  centers: Center[]
  isCreating: boolean
  onSave: () => void
  onCancel: () => void
}

export function AIModelForm({
  formData,
  setFormData,
  centers,
  isCreating,
  onSave,
  onCancel,
}: AIModelFormProps) {
  return (
    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
      <h3 className="text-sm font-medium text-gray-900 mb-4">
        {isCreating ? 'Add New AI Model' : 'Edit AI Model'}
      </h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Provider <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.provider}
            onChange={(e) =>
              setFormData({ ...formData, provider: e.target.value as AIModelProvider })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Select AI model provider"
            title="Select AI model provider"
          >
            <option value="">Select provider...</option>
            <option value="OPENAI">OpenAI (GPT-4, GPT-3.5)</option>
            <option value="GEMINI">Google Gemini</option>
            <option value="DEEPSEEK">DeepSeek</option>
          </select>
        </div>

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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Model Name (Optional)
          </label>
          <input
            type="text"
            value={formData.modelName}
            onChange={(e) => setFormData({ ...formData, modelName: e.target.value })}
            placeholder="e.g., gpt-4, gemini-pro, deepseek-chat"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

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

        <div className="flex gap-2">
          <button
            onClick={onSave}
            disabled={!formData.provider || !formData.apiKey.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isCreating ? 'Add Model' : 'Save Changes'}
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
