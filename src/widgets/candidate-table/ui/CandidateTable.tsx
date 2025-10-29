'use client'

import { useState } from 'react'
import { DataTable, type ColumnDef } from '@/shared/ui/data-table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { Spinner } from '@/shared/ui/Spinner'
import { Alert } from '@/shared/ui/Alert'
import { Badge } from '@/shared/ui/Badge'
import {
  getCandidateFullName,
  getCandidateStatusLabel,
  getCandidateInitials,
  type Candidate
} from '@/entities/candidate'
import { DeleteCandidateDialog } from '@/features/candidate-delete'
import { CandidateDetailsDrawer } from '@/features/candidate-details'
import { useCandidateTable } from '../model/useCandidateTable'
import { MoreVertical, Search } from 'lucide-react'

interface CandidateTableProps {
  onDeleteSuccess?: (message: string) => void
  refreshTrigger?: number
}

function CandidateActions({
  candidate,
  onSuccess,
  onDeleteSuccess
}: {
  candidate: Candidate
  onSuccess: () => void
  onDeleteSuccess?: (message: string) => void
}) {
  return (
    <CandidateDetailsDrawer>
      {({ onViewDetails }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewDetails(candidate.id)}
          >
            View
          </Button>

          <DeleteCandidateDialog
            onSuccess={() => {
              onSuccess()
              onDeleteSuccess?.(`Candidate ${getCandidateFullName(candidate)} deleted successfully`)
            }}
          >
            {({ onDelete }) => (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onViewDetails(candidate.id)}>
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => onDelete(candidate)}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </DeleteCandidateDialog>
        </div>
      )}
    </CandidateDetailsDrawer>
  )
}

export function CandidateTable({ onDeleteSuccess, refreshTrigger }: CandidateTableProps = {}) {
  const {
    candidates,
    loading,
    error,
    pagination,
    handleSearch,
    handleFilterStatus,
    refresh,
  } = useCandidateTable({ refreshTrigger })

  const [searchInput, setSearchInput] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch(searchInput)
  }

  const handleStatusChange = (value: string) => {
    setStatusFilter(value)
    handleFilterStatus(value === 'all' ? undefined : value)
  }

  const columns: ColumnDef<Candidate>[] = [
    {
      accessorKey: 'firstName',
      header: 'Candidate',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white text-sm font-semibold">
            {getCandidateInitials(row)}
          </div>
          <div>
            <div className="font-medium">{getCandidateFullName(row)}</div>
            <div className="text-sm text-muted-foreground">{row.email}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      cell: ({ row }) => row.phone || '—',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={row.status === 'APPROVED' ? 'default' : 'secondary'}>
          {getCandidateStatusLabel(row.status)}
        </Badge>
      ),
    },
    {
      accessorKey: 'isActive',
      header: 'Active',
      cell: ({ row }) => (
        <Badge variant={row.isActive ? 'default' : 'destructive'}>
          {row.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      cell: ({ row }) => new Date(row.createdAt).toLocaleDateString(),
    },
    {
      header: <div className="text-right">Actions</div>,
      cell: ({ row }) => (
        <div className="text-right">
          <CandidateActions
            candidate={row}
            onSuccess={refresh}
            onDeleteSuccess={onDeleteSuccess}
          />
        </div>
      ),
    },
  ]

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner />
        <span className="ml-2">Loading candidates...</span>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <div className="flex flex-col gap-2">
          <p>{error}</p>
          {error.includes('Authentication required') && (
            <a href="/login" className="text-sm underline hover:no-underline">
              Go to Login →
            </a>
          )}
        </div>
      </Alert>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter Controls */}
      <div className="flex items-center gap-4">
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-10"
            />
          </div>
        </form>

        <select
          value={statusFilter}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="all">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={candidates}
        emptyMessage="No candidates found"
      />

      {/* Pagination Info */}
      {pagination.total > 0 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <p>
            Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
            {pagination.total} candidates
          </p>
          <p>
            Page {pagination.page} of {pagination.totalPages}
          </p>
        </div>
      )}
    </div>
  )
}
