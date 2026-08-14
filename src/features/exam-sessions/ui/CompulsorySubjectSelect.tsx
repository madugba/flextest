import type { Subject } from '@/entities/subject'
import type { ExamSessionFormData } from '../model/types'

interface CompulsorySubjectSelectProps {
  formData: ExamSessionFormData
  onFieldChange: (field: keyof ExamSessionFormData, value: string) => void
  subjects: Subject[]
}

export function CompulsorySubjectSelect({
  formData,
  onFieldChange,
  subjects,
}: CompulsorySubjectSelectProps) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-2 block">
        Compulsory Subject (Select One)
      </label>
      <div className="border border-gray-300 rounded-lg p-3 max-h-48 overflow-y-auto bg-gray-50">
        {subjects.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">
            No subjects available. Please create subjects first.
          </p>
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
          {subjects.find((s) => s.id === formData.compulsorySubjectId)?.name} selected
        </p>
      )}
    </div>
  )
}
