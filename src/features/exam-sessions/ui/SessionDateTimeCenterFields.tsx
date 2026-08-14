import type { Center } from '@/entities/center'
import type { ExamSessionFormData } from '../model/types'

interface SessionDateTimeCenterFieldsProps {
  formData: ExamSessionFormData
  onFieldChange: (field: keyof ExamSessionFormData, value: string) => void
  centers: Center[]
}

export function SessionDateTimeCenterFields({
  formData,
  onFieldChange,
  centers,
}: SessionDateTimeCenterFieldsProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1.5 block">
          Date <span className="text-red-500">*</span>
        </label>
        <input
          title="Date"
          name="date"
          aria-label="Date"
          type="date"
          value={formData.date}
          onChange={(e) => onFieldChange('date', e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-1.5 block">
          Time <span className="text-red-500">*</span>
        </label>
        <input
          type="time"
          value={formData.time}
          onChange={(e) => onFieldChange('time', e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-1.5 block">
          Center <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.centerId}
          onChange={(e) => onFieldChange('centerId', e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          required
        >
          <option value="">Select a center</option>
          {centers.map((center) => (
            <option key={center.id} value={center.id}>
              {center.centerName}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
