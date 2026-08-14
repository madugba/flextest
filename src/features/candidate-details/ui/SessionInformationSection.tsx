import {
  getCandidateSessionName,
  getCandidateCenterName,
} from '@/entities/candidate'
import type { Candidate } from '@/entities/candidate'

interface SessionInformationSectionProps {
  candidate: Candidate
}

export function SessionInformationSection({ candidate }: SessionInformationSectionProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Exam Session
      </h3>
      <div className="space-y-3">
        <div>
          <span className="text-xs text-gray-500 block mb-1">Session</span>
          <span className="text-sm font-medium text-gray-900">{getCandidateSessionName(candidate)}</span>
        </div>
        <div>
          <span className="text-xs text-gray-500 block mb-1">Center</span>
          <span className="text-sm font-medium text-gray-900">{getCandidateCenterName(candidate)}</span>
        </div>
        {candidate.seatNumber && (
          <div>
            <span className="text-xs text-gray-500 block mb-1">Seat Number</span>
            <span className="text-sm font-medium text-gray-900">{candidate.seatNumber}</span>
          </div>
        )}
      </div>
    </div>
  )
}
