import type { Candidate } from '@/entities/candidate'

interface ContactInformationSectionProps {
  candidate: Candidate
}

export function ContactInformationSection({ candidate }: ContactInformationSectionProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        Contact Information
      </h3>
      <div className="space-y-3">
        <div>
          <span className="text-xs text-gray-500 block mb-1">Email Address</span>
          <span className="text-sm font-medium text-gray-900">{candidate.email || 'Not provided'}</span>
        </div>
        {candidate.phone && (
          <div>
            <span className="text-xs text-gray-500 block mb-1">Phone Number</span>
            <span className="text-sm font-medium text-gray-900">{candidate.phone}</span>
          </div>
        )}
      </div>
    </div>
  )
}
