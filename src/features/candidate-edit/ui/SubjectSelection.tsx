import { Alert } from '@/shared/ui/Alert'
import { Label } from '@/shared/ui/label'
import type { Subject } from '@/entities/subject'

interface SubjectSelectionProps {
  subjects: Subject[]
  selectedSubjects: string[]
  toggleSubject: (subjectId: string) => void
  isLoading: boolean
}

export function SubjectSelection({
  subjects,
  selectedSubjects,
  toggleSubject,
  isLoading,
}: SubjectSelectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">Registered Subjects</h3>
        <span className="text-sm text-gray-500">Selected: {selectedSubjects.length} of 6</span>
      </div>

      {subjects.length === 0 ? (
        <div className="text-center py-4 text-gray-500 text-sm">Loading subjects...</div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {subjects.map((subject) => {
            const isSelected = selectedSubjects.includes(subject.id)
            const isDisabled = !isSelected && selectedSubjects.length >= 6

            return (
              <div
                key={subject.id}
                className={`flex items-center space-x-2 p-3 rounded-lg border transition-colors ${
                  isSelected
                    ? 'bg-primary/5 border-primary/30'
                    : isDisabled
                    ? 'bg-gray-50 border-gray-200 opacity-50'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="checkbox"
                  id={`subject-${subject.id}`}
                  checked={isSelected}
                  onChange={() => toggleSubject(subject.id)}
                  disabled={isLoading || isDisabled}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary disabled:cursor-not-allowed"
                />
                <Label
                  htmlFor={`subject-${subject.id}`}
                  className={`text-sm font-normal cursor-pointer flex-1 ${
                    isDisabled ? 'cursor-not-allowed' : ''
                  }`}
                >
                  {subject.name}
                </Label>
              </div>
            )
          })}
        </div>
      )}

      {selectedSubjects.length === 0 && (
        <Alert variant="destructive" className="mt-2">
          Please select at least one subject
        </Alert>
      )}
    </div>
  )
}
