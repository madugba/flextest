import { Label } from '@/shared/ui/label'
import type { Subject } from '@/entities/subject'

interface DialogSubjectsFieldProps {
  subjects: Subject[]
  selectedSubjects: string[]
  toggleSubject: (subjectId: string) => void
}

export function DialogSubjectsField({
  subjects,
  selectedSubjects,
  toggleSubject,
}: DialogSubjectsFieldProps) {
  return (
    <div className="grid gap-2">
      <Label>
        Subjects <span className="text-red-500">*</span>
        <span className="text-xs text-gray-500 ml-2">
          (Select 1-6 subjects)
        </span>
      </Label>
      <div className="border border-gray-300 rounded-md p-3 max-h-48 overflow-y-auto">
        {subjects.length === 0 ? (
          <p className="text-sm text-gray-500">No subjects available. Please add subjects first.</p>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {subjects.map((subject) => (
              <label
                key={subject.id}
                className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
              >
                <input
                  type="checkbox"
                  checked={selectedSubjects.includes(subject.id)}
                  onChange={() => toggleSubject(subject.id)}
                  disabled={!selectedSubjects.includes(subject.id) && selectedSubjects.length >= 6}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm">{subject.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>
      {selectedSubjects.length > 0 && (
        <p className="text-xs text-gray-600">
          {selectedSubjects.length} subject{selectedSubjects.length !== 1 ? 's' : ''} selected
        </p>
      )}
    </div>
  )
}
