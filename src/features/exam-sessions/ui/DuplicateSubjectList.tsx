import type { Subject } from '@/entities/subject'

interface DuplicateSubjectListProps {
  sourceSubjects: Array<Subject & { questionCount: number }>
  selectedSubjectIds: string[]
  onToggleSubject: (subjectId: string) => void
  onSelectAll: () => void
  onDeselectAll: () => void
  isDuplicateLoading: boolean
}

export function DuplicateSubjectList({
  sourceSubjects,
  selectedSubjectIds,
  onToggleSubject,
  onSelectAll,
  onDeselectAll,
  isDuplicateLoading,
}: DuplicateSubjectListProps) {
  const selectedQuestionCount = sourceSubjects
    .filter((s) => selectedSubjectIds.includes(s.id))
    .reduce((sum, s) => sum + s.questionCount, 0)

  return (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-2 block">
        Subjects to Include
      </label>

      {isDuplicateLoading ? (
        <div className="border border-gray-200 rounded-lg p-6 text-center text-sm text-gray-500">
          Loading subjects…
        </div>
      ) : sourceSubjects.length === 0 ? (
        <div className="border border-gray-200 rounded-lg p-4 bg-yellow-50">
          <p className="text-sm text-yellow-800">
            No subjects with questions found in this session. You can still duplicate the session
            shell without questions.
          </p>
        </div>
      ) : (
        <>
          <div className="border border-gray-300 rounded-lg divide-y divide-gray-100 max-h-56 overflow-y-auto bg-gray-50">
            {sourceSubjects.map((subject) => (
              <label
                key={subject.id}
                className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-100 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedSubjectIds.includes(subject.id)}
                  onChange={() => onToggleSubject(subject.id)}
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="flex-1 text-sm text-gray-700">{subject.name}</span>
                <span className="text-xs text-gray-400 tabular-nums">
                  {subject.questionCount} question{subject.questionCount !== 1 ? 's' : ''}
                </span>
              </label>
            ))}
          </div>

          <div className="flex gap-3 mt-1.5">
            <button
              type="button"
              className="text-xs text-primary underline hover:no-underline"
              onClick={onSelectAll}
            >
              Select all
            </button>
            <button
              type="button"
              className="text-xs text-gray-500 underline hover:no-underline"
              onClick={onDeselectAll}
            >
              Deselect all
            </button>
          </div>
        </>
      )}

      {selectedSubjectIds.length > 0 && (
        <div className="mt-3 bg-blue-50 border border-blue-200 rounded-md p-3">
          <p className="text-xs text-blue-800">
            {selectedSubjectIds.length} subject{selectedSubjectIds.length !== 1 ? 's' : ''}
            {' — '}
            {selectedQuestionCount} question{selectedQuestionCount !== 1 ? 's' : ''} will be copied
            to the new session
          </p>
        </div>
      )}
    </div>
  )
}
