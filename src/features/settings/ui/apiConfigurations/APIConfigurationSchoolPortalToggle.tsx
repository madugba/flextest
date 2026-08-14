import type { Dispatch, SetStateAction } from 'react'
import type { APIConfigurationFormData } from '../../model/apiConfigurations/types'

interface APIConfigurationSchoolPortalToggleProps {
  formData: APIConfigurationFormData
  setFormData: Dispatch<SetStateAction<APIConfigurationFormData>>
}

export function APIConfigurationSchoolPortalToggle({
  formData,
  setFormData,
}: APIConfigurationSchoolPortalToggleProps) {
  return (
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
  )
}
