'use client'

import { useReportsTable } from '../model/useReportsTable'
import { Input } from '@/shared/ui/Input'
import { Button } from '@/shared/ui/Button'
import { Skeleton } from '@/shared/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'
import { Badge } from '@/shared/ui/Badge'
import { Search, MoreVertical, BarChart3, FileText, Trash2, RefreshCw, ArrowUpDown, Eye, Upload } from 'lucide-react'

interface ReportsTableProps {
  onAction?: (action: 'analysis' | 'print' | 'delete' | 'viewScore' | 'upload', sessionId: string, sessionName: string) => void
}

export function ReportsTable({ onAction }: ReportsTableProps) {
  const { sessions, loading, error, search, setSearch, sortBy, sortOrder, setSortBy, setSortOrder, refetch } = useReportsTable()

  const handleSort = (field: 'name' | 'date' | 'passRate') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getPassRateColor = (passRate: number) => {
    if (passRate >= 80) return 'bg-green-100 text-green-800 border-green-200'
    if (passRate >= 50) return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    return 'bg-red-100 text-red-800 border-red-200'
  }

  const handleRefresh = () => {
    refetch()
  }

  return (
    <div className="space-y-4">
      {/* Search and Actions Bar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search exam sessions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline" onClick={handleRefresh} size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border shadow-sm">
        {loading ? (
          <div className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : error ? (
          <div className="p-12 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button variant="outline" onClick={refetch}>
              Retry
            </Button>
          </div>
        ) : sessions.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-medium mb-2">No completed sessions found</p>
            <p className="text-gray-400 text-sm">
              {search ? 'Try adjusting your search criteria' : 'Completed exam sessions will appear here'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('name')}>
                    <div className="flex items-center gap-1">
                      Session Name
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('date')}>
                    <div className="flex items-center gap-1">
                      Date
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Candidates</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('passRate')}>
                    <div className="flex items-center gap-1">
                      Pass Rate
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.map((session) => {
                  const stats = session.statistics
                  const submittedPercent = stats && stats.scheduled > 0 
                    ? ((stats.submitted / stats.scheduled) * 100).toFixed(1)
                    : '0'

                  return (
                    <TableRow key={session.id}>
                      <TableCell className="font-medium">
                        <div>
                          <div>{session.name}</div>
                          {session.center && (
                            <div className="text-xs text-gray-500">
                              {session.center.centerName}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(session.date)}</TableCell>
                      <TableCell>{session.duration} min</TableCell>
                      <TableCell>{stats?.scheduled || 0}</TableCell>
                      <TableCell>
                        {stats?.submitted || 0}
                        {stats && stats.scheduled > 0 && (
                          <span className="text-xs text-gray-500 ml-1">({submittedPercent}%)</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {stats && typeof stats.passPercentage === 'number' ? (
                          <Badge variant="outline" className={getPassRateColor(stats.passPercentage)}>
                            {stats.passPercentage.toFixed(1)}%
                          </Badge>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onAction?.('analysis', session.id, session.name)}>
                              <BarChart3 className="mr-2 h-4 w-4" />
                              View Analysis
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onAction?.('print', session.id, session.name)}>
                              <FileText className="mr-2 h-4 w-4" />
                              Print Report
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onAction?.('viewScore', session.id, session.name)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Scores
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onAction?.('upload', session.id, session.name)}>
                              <Upload className="mr-2 h-4 w-4" />
                              Upload Results
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => onAction?.('delete', session.id, session.name)}
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Session
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Results Count */}
      {!loading && !error && sessions.length > 0 && (
        <div className="text-sm text-gray-600">
          Showing {sessions.length} completed session{sessions.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  )
}

