import type { AIModelFormData } from '../../model/aiModels/types'

interface AIModelFormActionsProps {
  formData: AIModelFormData
  isCreating: boolean
  onSave: () => void
  onCancel: () => void
}

export function AIModelFormActions({
  formData,
  isCreating,
  onSave,
  onCancel,
}: AIModelFormActionsProps) {
  return (
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
  )
}
