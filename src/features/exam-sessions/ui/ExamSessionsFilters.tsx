import { Input } from '@/shared/ui/Input'
import type { SessionStatus } from '@/entities/exam-session'

interface ExamSessionsFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  statusFilter: SessionStatus | ''
  onStatusFilterChange: (value: SessionStatus | '') => void
}

export function ExamSessionsFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: ExamSessionsFiltersProps) {
  return (
    <div className="flex gap-4">
      <div className="flex-1">
        <Input
          placeholder="Search exam sessions..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          fullWidth
        />
      </div>
      <select
        title="Status Filter"
        name="statusFilter"
        aria-label="Status Filter"
        value={statusFilter}
        onChange={(e) => onStatusFilterChange(e.target.value as SessionStatus | '')}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <option value="">All Statuses</option>
        <option value="SCHEDULED">Scheduled</option>
        <option value="ACTIVE">Active</option>
        <option value="COMPLETED">Completed</option>
        <option value="CANCELLED">Cancelled</option>
      </select>
    </div>
  )
}
