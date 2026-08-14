import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'
import { Calendar, FileText, LogOut, Search, UserMinus } from 'lucide-react'

interface MonitoringToolbarProps {
  selectedCount: number
  onBulkLogout: () => void
  filterStatus: string
  onFilterChange: (value: string) => void
  searchQuery: string
  onSearchChange: (value: string) => void
}

export function MonitoringToolbar({
  selectedCount,
  onBulkLogout,
  filterStatus,
  onFilterChange,
  searchQuery,
  onSearchChange,
}: MonitoringToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="destructive"
          className="gap-2"
          disabled={selectedCount === 0}
          onClick={onBulkLogout}
        >
          <LogOut className="h-4 w-4" />
          Logout {selectedCount > 0 ? `(${selectedCount})` : 'Candidate'}
        </Button>
        <Button size="sm" variant="outline" className="gap-2" disabled={selectedCount === 0}>
          <UserMinus className="h-4 w-4" />
          Suspend {selectedCount > 0 ? `(${selectedCount})` : 'Candidate'}
        </Button>
        <Button size="sm" variant="outline" className="gap-2">
          <Calendar className="h-4 w-4" />
          Reschedule
        </Button>
        <Button size="sm" variant="outline" className="gap-2">
          <FileText className="h-4 w-4" />
          Generate Report
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Select value={filterStatus} onValueChange={onFilterChange}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="submitted">Submitted</SelectItem>
            <SelectItem value="flagged">Flagged</SelectItem>
            <SelectItem value="absent">Absent</SelectItem>
          </SelectContent>
        </Select>

        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by name or reg..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
    </div>
  )
}
