interface ResetSessionsOptionsProps {
  includeStudents: boolean
  onIncludeStudentsChange: (checked: boolean) => void
  isAcknowledged: boolean
  onAcknowledgedChange: (checked: boolean) => void
}

export function ResetSessionsOptions({
  includeStudents,
  onIncludeStudentsChange,
  isAcknowledged,
  onAcknowledgedChange,
}: ResetSessionsOptionsProps) {
  return (
    <div className="space-y-3">
      <label className="flex items-start">
        <input
          type="checkbox"
          checked={includeStudents}
          onChange={(e) => onIncludeStudentsChange(e.target.checked)}
          className="mt-0.5 mr-2 rounded border-gray-300 text-red-600 focus:ring-red-500"
        />
        <div>
          <span className="text-sm font-medium text-gray-700">Delete all candidates</span>
          <p className="text-xs text-gray-500">
            If unchecked, candidates will be kept but unlinked from sessions
          </p>
        </div>
      </label>

      <label className="flex items-start">
        <input
          type="checkbox"
          checked={isAcknowledged}
          onChange={(e) => onAcknowledgedChange(e.target.checked)}
          className="mt-0.5 mr-2 rounded border-gray-300 text-red-600 focus:ring-red-500"
        />
        <span className="text-sm font-medium text-gray-700">
          I understand this action cannot be undone
        </span>
      </label>
    </div>
  )
}
