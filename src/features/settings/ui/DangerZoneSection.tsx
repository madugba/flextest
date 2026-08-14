interface DangerZoneSectionProps {
  onReset: () => void
}

export function DangerZoneSection({ onReset }: DangerZoneSectionProps) {
  return (
    <div className="mt-8 bg-white rounded-lg shadow border-2 border-red-200">
      <div className="px-6 py-4 bg-red-50 border-b border-red-200">
        <div className="flex items-center">
          <svg
            className="w-5 h-5 text-red-600 mr-3"
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
          <h2 className="text-lg font-semibold text-red-900">Danger Zone</h2>
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-red-900 mb-2">Reset All Exam Sessions</h3>
          <p className="text-sm text-red-700 mb-4">
            Permanently delete all exam sessions, questions, candidates, and their answers. This
            action cannot be undone and will remove all exam data from the system.
          </p>
          <button
            onClick={onReset}
            className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Reset All Sessions
          </button>
        </div>
      </div>
    </div>
  )
}
