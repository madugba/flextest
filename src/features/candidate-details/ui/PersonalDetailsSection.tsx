import type { Candidate } from '@/entities/candidate'

interface PersonalDetailsSectionProps {
  candidate: Candidate
}

export function PersonalDetailsSection({ candidate }: PersonalDetailsSectionProps) {
  if (!candidate.surname && !candidate.firstname) return null

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        Personal Details
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {candidate.surname && (
          <div>
            <span className="text-xs text-gray-500 block mb-1">Surname</span>
            <span className="text-sm font-medium text-gray-900">{candidate.surname}</span>
          </div>
        )}
        {candidate.firstname && (
          <div>
            <span className="text-xs text-gray-500 block mb-1">First Name</span>
            <span className="text-sm font-medium text-gray-900">{candidate.firstname}</span>
          </div>
        )}
        {candidate.othername && (
          <div className="col-span-2">
            <span className="text-xs text-gray-500 block mb-1">Other Name</span>
            <span className="text-sm font-medium text-gray-900">{candidate.othername}</span>
          </div>
        )}
      </div>
    </div>
  )
}
