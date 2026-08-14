import { BookOpen } from 'lucide-react'
import type { MonitoringCandidate } from '@/entities/monitoring'

interface CandidateSubjectsPanelProps {
  subjects: MonitoringCandidate['subjects']
  subjectQuestionCounts: Map<string, number>
}

export function CandidateSubjectsPanel({
  subjects,
  subjectQuestionCounts,
}: CandidateSubjectsPanelProps) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
        <BookOpen className="h-3.5 w-3.5" />
        Subjects ({subjects?.length ?? 0})
      </p>
      {subjects && subjects.length > 0 ? (
        <div className="space-y-2">
          {subjects.map((subject, i) => {
            const total = subjectQuestionCounts.get(subject.id) ?? null
            return (
              <div
                key={subject.id}
                className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-100"
              >
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-[10px] font-bold text-primary">{i + 1}</span>
                </div>
                <span className="text-sm font-medium text-gray-800 flex-1 truncate">
                  {subject.name}
                </span>
                {total !== null && (
                  <span className="text-xs text-gray-500 shrink-0 tabular-nums">
                    {total} questions
                  </span>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <p className="text-sm text-gray-400 italic">No subjects assigned</p>
      )}
    </div>
  )
}
