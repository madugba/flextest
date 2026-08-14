import { Checkbox } from '@/shared/ui/checkbox'
import { Label } from '@/shared/ui/label'
import { X } from 'lucide-react'
import type { Subject } from '@/entities/subject'

interface SubjectSelectionSectionProps {
  subjects: Subject[]
  selectedSubjects: string[]
  toggleSubject: (subjectId: string) => void
  isLoading: boolean
}

export function SubjectSelectionSection({
  subjects,
  selectedSubjects,
  toggleSubject,
  isLoading,
}: SubjectSelectionSectionProps) {
  return (
    <div className="grid gap-2">
      <Label>
        Subjects (Select 1-6) <span className="text-red-500">*</span>
      </Label>
      <div className="border rounded-lg p-4 max-h-60 overflow-y-auto">
        {subjects.length === 0 ? (
          <p className="text-sm text-muted-foreground">Loading subjects...</p>
        ) : (
          <div className="grid gap-3">
            {subjects.map((subject) => (
              <div key={subject.id} className="flex items-center space-x-2">
                <Checkbox
                  id={subject.id}
                  checked={selectedSubjects.includes(subject.id)}
                  onCheckedChange={() => toggleSubject(subject.id)}
                  disabled={isLoading || (!selectedSubjects.includes(subject.id) && selectedSubjects.length >= 6)}
                />
                <Label
                  htmlFor={subject.id}
                  className="text-sm font-normal cursor-pointer"
                >
                  {subject.name}
                </Label>
              </div>
            ))}
          </div>
        )}
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">
          Selected: {selectedSubjects.length} of 6 (minimum 1 required)
        </p>
        {selectedSubjects.length > 0 && (
          <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg border">
            {selectedSubjects.map((subjectId) => {
              const subject = subjects.find(s => s.id === subjectId)
              return (
                <div
                  key={subjectId}
                  className="flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-sm"
                >
                  <span>{subject?.name}</span>
                  <button
                    type="button"
                    onClick={() => toggleSubject(subjectId)}
                    className="hover:bg-primary-foreground/20 rounded-full p-0.5"
                    disabled={isLoading}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
