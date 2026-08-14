import type { APIConfigurationFormData } from '../../model/apiConfigurations/types'

interface APIConfigurationFormActionsProps {
  formData: APIConfigurationFormData
  isCreating: boolean
  onSave: () => void
  onCancel: () => void
}

export function APIConfigurationFormActions({
  formData,
  isCreating,
  onSave,
  onCancel,
}: APIConfigurationFormActionsProps) {
  return (
    <div className="flex gap-2">
      <button
        onClick={onSave}
        disabled={!formData.name.trim() || !formData.apiEndpoint.trim() || !formData.centerId}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {isCreating ? 'Create' : 'Save'}
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
