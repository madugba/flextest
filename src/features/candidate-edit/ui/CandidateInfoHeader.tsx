import { getCandidateFullName } from '@/entities/candidate'
import type { Candidate } from '@/entities/candidate'

interface CandidateInfoHeaderProps {
  candidate: Candidate
}

export function CandidateInfoHeader({ candidate }: CandidateInfoHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-4 border border-primary/20">
      <div className="flex items-center gap-4">
        {candidate.picture ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={candidate.picture}
            alt={getCandidateFullName(candidate)}
            className="w-16 h-16 rounded-lg object-cover border-2 border-white shadow-sm"
          />
        ) : (
          <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center border-2 border-white shadow-sm">
            <span className="text-xl font-bold text-primary">
              {candidate.firstname?.charAt(0) || candidate.firstName?.charAt(0) || '?'}
            </span>
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900">{getCandidateFullName(candidate)}</h3>
          <p className="text-sm text-gray-600 font-mono">{candidate.id}</p>
        </div>
      </div>
    </div>
  )
}
