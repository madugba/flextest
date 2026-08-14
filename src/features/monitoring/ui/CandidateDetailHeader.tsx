import { Badge } from '@/shared/ui/Badge'
import type { MonitoringCandidate } from '@/entities/monitoring'
import type { DisplayCandidate } from '../model/selectors/formatCandidateForDisplay'
import { getStatusColor } from '../model/selectors/getStatusColor'

interface CandidateDetailHeaderProps {
  candidate: DisplayCandidate
  rawCandidate: MonitoringCandidate
}

export function CandidateDetailHeader({ candidate, rawCandidate }: CandidateDetailHeaderProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
        <span className="text-white text-base font-semibold">{candidate.initials}</span>
      </div>
      <div className="min-w-0">
        <p className="text-base leading-tight font-semibold">{candidate.name}</p>
        <p className="text-xs mt-0.5 text-gray-500">
          Reg # {candidate.registrationNumber}
          {rawCandidate.seatNumber ? ` · Seat ${rawCandidate.seatNumber}` : ''}
        </p>
      </div>
      <Badge className={`ml-auto shrink-0 border capitalize ${getStatusColor(candidate.status)}`}>
        {candidate.status}
      </Badge>
    </div>
  )
}
