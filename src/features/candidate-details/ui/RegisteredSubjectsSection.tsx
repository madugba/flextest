import { Badge } from '@/shared/ui/Badge'
import type { Candidate } from '@/entities/candidate'

interface RegisteredSubjectsSectionProps {
  candidate: Candidate
}

export function RegisteredSubjectsSection({ candidate }: RegisteredSubjectsSectionProps) {
  if (!candidate.subjectCombinations || candidate.subjectCombinations.length === 0) return null

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        Registered Subjects ({candidate.subjectCombinations.length})
      </h3>
      <div className="flex flex-wrap gap-2">
        {candidate.subjectCombinations.map((combo) => (
          <Badge key={combo.id} variant="outline" className="px-3 py-1.5">
            {combo.subject.name}
          </Badge>
        ))}
      </div>
    </div>
  )
}
