import { Badge } from '@/shared/ui/Badge'
import { formatCandidateLastLogin } from '@/entities/candidate'
import type { Candidate } from '@/entities/candidate'

interface AccountStatusSectionProps {
  candidate: Candidate
}

export function AccountStatusSection({ candidate }: AccountStatusSectionProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Account Status
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <span className="text-xs text-gray-500 block mb-1">Verified</span>
          <Badge variant={candidate.isVerified ? 'default' : 'secondary'} className="mt-1">
            {candidate.isVerified ? 'Verified' : 'Not Verified'}
          </Badge>
        </div>
        <div>
          <span className="text-xs text-gray-500 block mb-1">Last Login</span>
          <span className="text-sm font-medium text-gray-900">{formatCandidateLastLogin(candidate)}</span>
        </div>
      </div>
    </div>
  )
}
