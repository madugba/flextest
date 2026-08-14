'use client'

interface OverallProgressCardProps {
  totalUploaded: number
  totalRequired: number
  overallProgress: number
  exceedsLimit: boolean
  sessionTotalQuestion?: number
}

export function OverallProgressCard({
  totalUploaded,
  totalRequired,
  overallProgress,
  exceedsLimit,
  sessionTotalQuestion,
}: OverallProgressCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Overall Progress</h2>
          <p className="text-sm text-gray-500 mt-1">
            {totalUploaded} of {totalRequired} questions uploaded
            {exceedsLimit && (
              <span className="text-red-600 font-medium ml-2">
                • Exceeds session limit ({sessionTotalQuestion})
              </span>
            )}
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-gray-900">{overallProgress.toFixed(0)}%</div>
          <div className="text-sm text-gray-500">Complete</div>
        </div>
      </div>

      <div className="relative w-full bg-gray-100 rounded-full h-3 overflow-hidden">
        <div
          className={`h-3 transition-all duration-500 ${
            overallProgress === 100
              ? 'bg-green-500'
              : exceedsLimit
              ? 'bg-red-500'
              : 'bg-blue-500'
          }`}
          style={{ width: `${Math.min(overallProgress, 100)}%` }}
        />
      </div>
    </div>
  )
}
