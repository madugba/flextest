import { Input } from '@/shared/ui/Input'
import type { Center } from '@/entities/center'
import type { Subject } from '@/entities/subject'
import type { ExamSessionFormData } from '../model/types'

interface ExamSessionFormFieldsProps {
  formData: ExamSessionFormData
  onFieldChange: (field: keyof ExamSessionFormData, value: string) => void
  centers: Center[]
  subjects: Subject[]
}

export function ExamSessionFormFields({
  formData,
  onFieldChange,
  centers,
  subjects,
}: ExamSessionFormFieldsProps) {
  return (
    <div className="space-y-4 mt-2">
      {/* Session Name */}
      <Input
        label="Session Name"
        placeholder="e.g., UTME 2024 First Sitting"
        value={formData.name}
        onChange={(e) => onFieldChange('name', e.target.value)}
        fullWidth
        required
      />

      {/* Date, Time, Center */}
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

      {/* Duration */}
      <Input
        label="Duration (minutes)"
        type="number"
        placeholder="e.g., 60 (default 1 hour)"
        value={formData.duration}
        onChange={(e) => onFieldChange('duration', e.target.value)}
        fullWidth
        required
      />

      {/* Compulsory Subject Selection (Single) */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          Compulsory Subject (Select One)
        </label>
        <div className="border border-gray-300 rounded-lg p-3 max-h-48 overflow-y-auto bg-gray-50">
          {subjects.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">No subjects available. Please create subjects first.</p>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {subjects.map((subject) => (
                <label
                  key={subject.id}
                  className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded cursor-pointer"
                >
                  <input
                    type="radio"
                    name="compulsorySubject"
                    checked={formData.compulsorySubjectId === subject.id}
                    onChange={() => onFieldChange('compulsorySubjectId', subject.id)}
                    className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700">{subject.name}</span>
                </label>
              ))}
            </div>
          )}
        </div>
        {formData.compulsorySubjectId && (
          <p className="text-xs text-gray-600 mt-1">
            {subjects.find(s => s.id === formData.compulsorySubjectId)?.name} selected
          </p>
        )}
      </div>

      {/* Questions Configuration */}
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Hall Capacity"
          type="number"
          placeholder="e.g., 100"
          value={formData.hallCapacity}
          onChange={(e) => onFieldChange('hallCapacity', e.target.value)}
          fullWidth
        />

        <Input
          label="Total Questions"
          type="number"
          placeholder="e.g., 180"
          value={formData.totalQuestion}
          onChange={(e) => onFieldChange('totalQuestion', e.target.value)}
          fullWidth
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Compulsory Questions"
          type="number"
          placeholder="e.g., 60"
          value={formData.totalCompulsoryQuestion}
          onChange={(e) => onFieldChange('totalCompulsoryQuestion', e.target.value)}
          fullWidth
        />

        <Input
          label="Other Questions"
          type="number"
          placeholder="e.g., 120"
          value={formData.totalOtherQuestions}
          onChange={(e) => onFieldChange('totalOtherQuestions', e.target.value)}
          fullWidth
        />
      </div>
    </div>
  )
}
