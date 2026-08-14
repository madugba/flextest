interface CandidateProgressPanelProps {
  progressPct: number
  attempted: number
  totalQuestions: number
}

export function CandidateProgressPanel({
  progressPct,
  attempted,
  totalQuestions,
}: CandidateProgressPanelProps) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
        Overall Progress
      </p>
      <div className="bg-gray-50 rounded-xl p-4 space-y-3">
        <div className="flex justify-between items-baseline">
          <span className="text-3xl font-bold text-gray-900">{progressPct}%</span>
          <span className="text-sm text-gray-500">
            {attempted} / {totalQuestions} questions
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all ${
              progressPct >= 80
                ? 'bg-green-500'
                : progressPct >= 50
                ? 'bg-blue-500'
                : 'bg-orange-400'
            }`}
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>
    </div>
  )
}
