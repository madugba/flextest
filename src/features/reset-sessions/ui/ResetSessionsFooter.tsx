interface ResetSessionsFooterProps {
  isDeleting: boolean
  canConfirm: boolean
  onCancel: () => void
  onConfirm: () => void
}

export function ResetSessionsFooter({
  isDeleting,
  canConfirm,
  onCancel,
  onConfirm,
}: ResetSessionsFooterProps) {
  return (
    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
      <button
        onClick={onCancel}
        disabled={isDeleting}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Cancel
      </button>
      <button
        onClick={onConfirm}
        disabled={!canConfirm}
        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        {isDeleting ? 'Deleting...' : 'Delete Everything'}
      </button>
    </div>
  )
}
