import type { Candidate } from '@/entities/candidate'

interface TimestampsSectionProps {
  candidate: Candidate
}

export function TimestampsSection({ candidate }: TimestampsSectionProps) {
  return (
    <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div>
          <span className="text-gray-500 block mb-1">Created</span>
          <span className="font-medium text-gray-700">
            {new Date(candidate.createdAt).toLocaleString()}
          </span>
        </div>
        <div>
          <span className="text-gray-500 block mb-1">Updated</span>
          <span className="font-medium text-gray-700">
            {new Date(candidate.updatedAt).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  )
}
