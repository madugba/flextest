import { Badge } from '@/shared/ui/Badge'
import {
  getCandidateFullName,
  getCandidateStatusLabel,
} from '@/entities/candidate'
import type { Candidate } from '@/entities/candidate'

interface CandidateIdentitySectionProps {
  candidate: Candidate
}

export function CandidateIdentitySection({ candidate }: CandidateIdentitySectionProps) {
  return (
    <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-4 border border-primary/20">
      <div className="flex items-center gap-4">
        {candidate.picture ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={candidate.picture}
            alt={getCandidateFullName(candidate)}
            className="w-20 h-20 rounded-lg object-cover border-2 border-white shadow-sm"
          />
        ) : (
          <div className="w-20 h-20 rounded-lg bg-primary/10 flex items-center justify-center border-2 border-white shadow-sm">
            <span className="text-2xl font-bold text-primary">
              {candidate.firstname?.charAt(0) || candidate.firstName?.charAt(0) || '?'}
            </span>
          </div>
        )}
        <div className="flex-1">
          <h2 className="text-lg font-bold text-gray-900">{getCandidateFullName(candidate)}</h2>
          <p className="text-sm text-gray-600 font-mono">{candidate.id}</p>
          <div className="flex gap-2 mt-2">
            <Badge variant={candidate.status === 'APPROVED' ? 'default' : 'secondary'}>
              {getCandidateStatusLabel(candidate.status)}
            </Badge>
            <Badge variant={candidate.isActive ? 'default' : 'destructive'}>
              {candidate.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  )
}
