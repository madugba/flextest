interface ResetSessionsHeaderProps {
  timeLeft: number
}

export function ResetSessionsHeader({ timeLeft }: ResetSessionsHeaderProps) {
  return (
    <div className="px-6 py-4 border-b border-gray-200 bg-red-50">
      <div className="flex items-center">
        <svg
          className="w-6 h-6 text-red-600 mr-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <h2 className="text-xl font-semibold text-red-900">Confirm Reset All Sessions</h2>
      </div>
      <div className="mt-2 text-sm text-red-700">Time remaining: {timeLeft} seconds</div>
    </div>
  )
}
