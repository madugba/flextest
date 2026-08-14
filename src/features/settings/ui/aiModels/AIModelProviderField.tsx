import type { Dispatch, SetStateAction } from 'react'
import type { AIModelProvider } from '@/entities/ai-model'
import type { AIModelFormData } from '../../model/aiModels/types'

interface AIModelProviderFieldProps {
  formData: AIModelFormData
  setFormData: Dispatch<SetStateAction<AIModelFormData>>
}

export function AIModelProviderField({ formData, setFormData }: AIModelProviderFieldProps) {
  return (
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
  )
}
