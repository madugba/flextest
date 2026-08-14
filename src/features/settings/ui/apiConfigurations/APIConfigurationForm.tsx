import type { Dispatch, SetStateAction } from 'react'
import type { Center } from '@/entities/center'
import type { APIConfigurationFormData } from '../../model/apiConfigurations/types'

interface APIConfigurationFormProps {
  formData: APIConfigurationFormData
  setFormData: Dispatch<SetStateAction<APIConfigurationFormData>>
  centers: Center[]
  isCreating: boolean
  onSave: () => void
  onCancel: () => void
}

export function APIConfigurationForm({
  formData,
  setFormData,
  centers,
  isCreating,
  onSave,
  onCancel,
}: APIConfigurationFormProps) {
  return (
    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
      <h3 className="text-sm font-medium text-gray-900 mb-4">
        {isCreating ? 'Create New Configuration' : 'Edit Configuration'}
      </h3>
      <div className="space-y-4">
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Configuration Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Production API, Test API"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="mt-1 text-xs text-gray-500">
            This name will be shown when selecting a configuration during import
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            API Endpoint <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.apiEndpoint}
            onChange={(e) => setFormData({ ...formData, apiEndpoint: e.target.value })}
            placeholder="https://api.example.com/"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            API Key (Optional)
          </label>
          <input
            type="password"
            value={formData.apiKey}
            onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
            placeholder="Optional API key for authentication"
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
            placeholder="Optional description of this API configuration"
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isSchoolPortal"
            checked={formData.isSchoolPortal}
            onChange={(e) => setFormData({ ...formData, isSchoolPortal: e.target.checked })}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="isSchoolPortal" className="ml-2 text-sm font-medium text-gray-700">
            Mark as School Portal
          </label>
        </div>

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
      </div>
    </div>
  )
}
