import type { Dispatch, SetStateAction } from 'react'
import { Loader2, Search } from 'lucide-react'
import { labelCls } from './import-form-classes'
import type { SubjectWithQuestionCount } from '../model/types'

export function SubjectPicker({
  availableSubjects,
  selectedSubjects,
  setSelectedSubjects,
  isLoadingSubjects,
  subjectSearch,
  setSubjectSearch,
}: {
  availableSubjects: SubjectWithQuestionCount
  selectedSubjects: string[]
  setSelectedSubjects: Dispatch<SetStateAction<string[]>>
  isLoadingSubjects: boolean
  subjectSearch: string
  setSubjectSearch: (value: string) => void
}) {
  return (
    <div>
      <p className={labelCls}>Subjects <span className="text-red-400 normal-case font-normal text-xs">* up to 4</span></p>

      {!isLoadingSubjects && availableSubjects.length > 0 && (
        <div className="relative mb-2">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search subjects…"
            value={subjectSearch}
            onChange={(e) => setSubjectSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      )}

      <div className="border border-gray-200 rounded-lg p-2 max-h-44 overflow-y-auto">
        {isLoadingSubjects ? (
          <div className="flex items-center gap-2 py-3 px-2 text-sm text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading subjects…
          </div>
        ) : availableSubjects.length === 0 ? (
          <p className="py-3 px-2 text-sm text-gray-500">No subjects for this session</p>
        ) : (() => {
          const filtered = availableSubjects.filter(s =>
            s.name.toLowerCase().includes(subjectSearch.toLowerCase())
          )
          return filtered.length === 0 ? (
            <p className="py-3 px-2 text-sm text-gray-500">No subjects match your search</p>
          ) : (
            <div className="space-y-0.5">
              {filtered.map(subject => (
                <label
                  key={subject.id}
                  className={`flex items-center gap-2.5 px-2 py-2 rounded-md cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedSubjects.includes(subject.id) ? 'bg-primary/5' : ''
                  }`}
                >
                  <input
                    type="checkbox"
                    value={subject.id}
                    checked={selectedSubjects.includes(subject.id)}
                    disabled={!selectedSubjects.includes(subject.id) && selectedSubjects.length >= 4}
                    onChange={(e) => {
                      if (e.target.checked && selectedSubjects.length < 4) {
                        setSelectedSubjects([...selectedSubjects, subject.id])
                      } else if (!e.target.checked) {
                        setSelectedSubjects(selectedSubjects.filter(id => id !== subject.id))
                      }
                    }}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary/30 flex-shrink-0"
                  />
                  <span className="text-sm leading-tight">
                    {subject.name}
                    <span className="text-xs text-gray-400 ml-1.5">({subject.questionCount}q)</span>
                  </span>
                </label>
              ))}
            </div>
          )
        })()}
      </div>

      {selectedSubjects.length > 0 && (
        <p className="mt-1 text-xs text-primary font-medium">
          {selectedSubjects.length} subject{selectedSubjects.length > 1 ? 's' : ''} selected
        </p>
      )}
    </div>
  )
}
