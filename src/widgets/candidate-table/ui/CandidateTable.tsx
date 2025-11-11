'use client'

import { useState } from 'react'
import * as React from 'react'
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
import { EditCandidateDialog } from '@/features/candidate-edit'
import { useCandidateTable } from '../model/useCandidateTable'
import { MoreVertical, Search, Printer } from 'lucide-react'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/shared/ui/pagination'

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
        <EditCandidateDialog onSuccess={onSuccess}>
          {({ onEdit }) => (
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
                    <DropdownMenuItem onClick={() => onEdit(candidate.id)}>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
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
          )}
        </EditCandidateDialog>
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
    handlePageChange,
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

  const handlePrint = () => {
    window.print()
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
      accessorKey: 'id',
      header: 'Candidate ID',
      cell: ({ row }) => (
        <span className="font-mono text-sm">{row.id}</span>
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
      cell: ({ row }) => {
        const status = row.status
        const getStatusBadgeProps = () => {
          switch (status) {
            case 'APPROVED':
              return {
                variant: 'default' as const,
                className: 'bg-green-500 text-white hover:bg-green-600 border-transparent',
              }
            case 'PENDING':
              return {
                variant: 'secondary' as const,
                className: 'bg-yellow-500 text-white hover:bg-yellow-600 border-transparent',
              }
            case 'REJECTED':
              return {
                variant: 'destructive' as const,
                className: 'bg-red-500 text-white hover:bg-red-600 border-transparent',
              }
            case 'SUBMITTED':
              return {
                variant: 'default' as const,
                className: 'bg-blue-500 text-white hover:bg-blue-600 border-transparent',
              }
            case 'ACTIVE':
              return {
                variant: 'default' as const,
                className: 'bg-emerald-500 text-white hover:bg-emerald-600 border-transparent',
              }
            case 'ACTIVATE':
              return {
                variant: 'outline' as const,
                className: 'bg-purple-500 text-white hover:bg-purple-600 border-transparent',
              }
            default:
              return {
                variant: 'secondary' as const,
                className: 'border-transparent',
              }
          }
        }

        const badgeProps = getStatusBadgeProps()
        return (
          <Badge variant={badgeProps.variant} className={badgeProps.className}>
            {getCandidateStatusLabel(status)}
          </Badge>
        )
      },
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
      <div className="flex items-center gap-4 no-print">
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
          aria-label="Filter by status"
          className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="all">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
          <option value="SUBMITTED">Submitted</option>
          <option value="ACTIVE">Active</option>
          <option value="ACTIVATE">Activate</option>
        </select>

        <Button onClick={handlePrint} variant="outline" size="default">
          <Printer className="h-4 w-4 mr-2" />
          Print
        </Button>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={candidates}
        emptyMessage="No candidates found"
      />

      {/* Pagination */}
      {pagination.total > 0 && (
        <div className="space-y-4 no-print">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p>
              Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
              {pagination.total} candidates
            </p>
          </div>

          {pagination.totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={(e) => {
                      e.preventDefault()
                      if (pagination.page > 1) {
                        handlePageChange(pagination.page - 1)
                      }
                    }}
                    className={
                      pagination.page === 1
                        ? 'pointer-events-none opacity-50 cursor-not-allowed'
                        : 'cursor-pointer'
                    }
                    href="#"
                  />
                </PaginationItem>

                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                  .filter((page) => {
                    // Show first page, last page, current page, and pages around current
                    const current = pagination.page
                    return (
                      page === 1 ||
                      page === pagination.totalPages ||
                      (page >= current - 1 && page <= current + 1)
                    )
                  })
                  .map((page, index, array) => {
                    // Add ellipsis if there's a gap
                    const prevPage = array[index - 1]
                    const showEllipsisBefore = prevPage && page - prevPage > 1

                    return (
                      <React.Fragment key={page}>
                        {showEllipsisBefore && (
                          <PaginationItem>
                            <span className="px-3 py-2">...</span>
                          </PaginationItem>
                        )}
                        <PaginationItem>
                          <PaginationLink
                            onClick={(e) => {
                              e.preventDefault()
                              handlePageChange(page)
                            }}
                            isActive={page === pagination.page}
                            className="cursor-pointer"
                            href="#"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      </React.Fragment>
                    )
                  })}

                <PaginationItem>
                  <PaginationNext
                    onClick={(e) => {
                      e.preventDefault()
                      if (pagination.page < pagination.totalPages) {
                        handlePageChange(pagination.page + 1)
                      }
                    }}
                    className={
                      pagination.page === pagination.totalPages
                        ? 'pointer-events-none opacity-50 cursor-not-allowed'
                        : 'cursor-pointer'
                    }
                    href="#"
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      )}
    </div>
  )
}
