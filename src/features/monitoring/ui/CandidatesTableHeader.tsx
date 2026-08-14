interface CandidatesTableHeaderProps {
  isAllSelected: boolean
  isIndeterminate: boolean
  onSelectAll: () => void
}

export function CandidatesTableHeader({
  isAllSelected,
  isIndeterminate,
  onSelectAll,
}: CandidatesTableHeaderProps) {
  return (
    <thead className="bg-gray-50 border-b border-gray-200">
      <tr>
        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              className="rounded border-gray-300"
              title="Select all candidates"
              checked={isAllSelected}
              onChange={onSelectAll}
              ref={(el) => {
                if (el) {
                  el.indeterminate = isIndeterminate
                }
              }}
            />
            <span title="Select all candidates">Registration #</span>
          </div>
        </th>
        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Name
        </th>
        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Client Info
        </th>
        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Progress
        </th>
        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Status
        </th>
        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Actions
        </th>
      </tr>
    </thead>
  )
}
