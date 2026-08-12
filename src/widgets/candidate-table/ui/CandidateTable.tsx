'use client'

import { useState, useCallback } from 'react'
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { Spinner } from '@/shared/ui/Spinner'
import { Alert } from '@/shared/ui/Alert'
import { Badge } from '@/shared/ui/Badge'
import { Checkbox } from '@/shared/ui/checkbox'
import {
  getCandidateFullName,
  getCandidateStatusLabel,
  getCandidateInitials,
  type Candidate,
} from '@/entities/candidate'
import { getAllExamSessions, type ExamSession } from '@/entities/exam-session'
import { DeleteCandidateDialog, getBlockedCandidateIds } from '@/features/candidate-delete'
import { CandidateDetailsDrawer } from '@/features/candidate-details'
import { EditCandidateDialog } from '@/features/candidate-edit'
import { useCandidateTable } from '../model/useCandidateTable'
import { MoreVertical, Search, Printer, RefreshCw, X, Trash2 } from 'lucide-react'
import { deleteCandidate } from '@/entities/candidate'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/shared/ui/pagination'
import { toast } from 'sonner'

interface CandidateTableProps {
  onDeleteSuccess?: (message: string) => void
  onRefresh?: () => void
  refreshTrigger?: number
}

// A candidate can only be session-reassigned when not in an active running exam.
function isReassignable(candidate: Candidate): boolean {
  return (candidate.status as string | undefined) !== 'ACTIVE'
}

function CandidateActions({
  candidate,
  onSuccess,
  onDeleteSuccess,
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

export function CandidateTable({ onDeleteSuccess, onRefresh, refreshTrigger }: CandidateTableProps = {}) {
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

  // ---------------------------------------------------------------------------
  // Multi-select state
  // ---------------------------------------------------------------------------
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  // ---------------------------------------------------------------------------
  // Bulk-delete dialog state
  // ---------------------------------------------------------------------------
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false)
  const [isBulkVerifying, setIsBulkVerifying]           = useState(false)
  const [isBulkDeleting, setIsBulkDeleting]             = useState(false)
  const [verifiedBlockedIds, setVerifiedBlockedIds]     = useState<Set<string> | null>(null)

  // ---------------------------------------------------------------------------
  // Re-assign session dialog state
  // ---------------------------------------------------------------------------
  const [showReassignDialog, setShowReassignDialog] = useState(false)
  const [sessions, setSessions] = useState<ExamSession[]>([])
  const [sessionsLoading, setSessionsLoading] = useState(false)
  const [reassignSessionId, setReassignSessionId] = useState('')
  const [isReassigning, setIsReassigning] = useState(false)

  // ---------------------------------------------------------------------------
  // Selection helpers
  // ---------------------------------------------------------------------------
  // Only candidates that are not actively in an exam can be selected.
  const reassignableCandidates = candidates.filter(isReassignable)

  const allPageSelected =
    reassignableCandidates.length > 0 &&
    reassignableCandidates.every((c) => selectedIds.has(c.id))

  const toggleAll = useCallback(() => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (allPageSelected) {
        reassignableCandidates.forEach((c) => next.delete(c.id))
      } else {
        reassignableCandidates.forEach((c) => next.add(c.id))
      }
      return next
    })
  }, [allPageSelected, reassignableCandidates])

  const toggleOne = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const clearSelection = useCallback(() => setSelectedIds(new Set()), [])

  // ---------------------------------------------------------------------------
  // Open re-assign dialog — fetch sessions on open
  // ---------------------------------------------------------------------------
  const openReassignDialog = async () => {
    setReassignSessionId('')
    setShowReassignDialog(true)
    setSessionsLoading(true)
    try {
      const data = await getAllExamSessions()
      setSessions(data)
    } catch {
      toast.error('Failed to load exam sessions')
      setShowReassignDialog(false)
    } finally {
      setSessionsLoading(false)
    }
  }

  // ---------------------------------------------------------------------------
  // Execute re-assignment
  // ---------------------------------------------------------------------------
  const handleReassign = async () => {
    if (!reassignSessionId) {
      toast.error('Please select a session')
      return
    }

    const idsToReassign = [...selectedIds]
    if (idsToReassign.length === 0) return

    setIsReassigning(true)
    try {
      const res = await fetch('/api/candidates/reassign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidateIds: idsToReassign, sessionId: reassignSessionId }),
      })

      // Parse JSON defensively — a 500 may return an HTML error page
      let json: { success?: boolean; updated?: number; error?: string } = {}
      try {
        json = (await res.json()) as typeof json
      } catch {
        // non-JSON body (e.g. Next.js HTML error page); fall through to the !res.ok check
      }

      if (!res.ok || !json.success) {
        toast.error(json.error ?? `Reassignment failed (HTTP ${res.status})`)
        return
      }

      setShowReassignDialog(false)
      clearSelection()
      onRefresh?.()
      toast.success(
        `${json.updated} candidate${(json.updated ?? 0) !== 1 ? 's' : ''} reassigned successfully`,
      )
    } catch {
      toast.error('Network error — could not reach reassign endpoint')
    } finally {
      setIsReassigning(false)
    }
  }

  // ---------------------------------------------------------------------------
  // Bulk delete — verify ALL sessions before deleting (not just current status)
  // ---------------------------------------------------------------------------
  const selectedCandidates = candidates.filter((c) => selectedIds.has(c.id))

  // Live-verified split: populated after openBulkDeleteDialog() completes verification
  const verifiedDeletable = verifiedBlockedIds !== null
    ? selectedCandidates.filter((c) => !verifiedBlockedIds.has(c.id))
    : []
  const verifiedSkipped = verifiedBlockedIds !== null
    ? selectedCandidates.filter((c) => verifiedBlockedIds.has(c.id))
    : []

  const openBulkDeleteDialog = async () => {
    setVerifiedBlockedIds(null)
    setShowBulkDeleteDialog(true)
    setIsBulkVerifying(true)
    try {
      const blocked = await getBlockedCandidateIds([...selectedIds])
      setVerifiedBlockedIds(blocked)
    } catch {
      // If verification fails fall back to blocking everyone — safer than allowing bad deletes
      setVerifiedBlockedIds(new Set([...selectedIds]))
      toast.error('Could not verify session history — all deletions blocked as a precaution')
    } finally {
      setIsBulkVerifying(false)
    }
  }

  const handleBulkDelete = async () => {
    if (!verifiedDeletable.length) return
    setIsBulkDeleting(true)
    const results = await Promise.allSettled(
      verifiedDeletable.map((c) => deleteCandidate(c.id))
    )
    setIsBulkDeleting(false)
    setShowBulkDeleteDialog(false)
    setVerifiedBlockedIds(null)

    const succeeded = results.filter((r) => r.status === 'fulfilled').length
    const failed    = results.filter((r) => r.status === 'rejected').length

    if (succeeded > 0) {
      clearSelection()
      refresh()
      onRefresh?.()
    }

    if (failed > 0 && succeeded > 0) {
      toast.warning(`${succeeded} deleted, ${failed} failed — check individual candidates for errors`)
    } else if (failed > 0) {
      toast.error(`All ${failed} deletions failed`)
    } else {
      toast.success(`${succeeded} candidate${succeeded !== 1 ? 's' : ''} deleted successfully`)
    }
  }

  // ---------------------------------------------------------------------------
  // Other handlers
  // ---------------------------------------------------------------------------
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch(searchInput)
  }

  const handleStatusChange = (value: string) => {
    setStatusFilter(value)
    handleFilterStatus(value === 'all' ? undefined : value)
    clearSelection()
  }

  const handlePrint = () => window.print()

  // ---------------------------------------------------------------------------
  // Columns
  // ---------------------------------------------------------------------------
  const columns: ColumnDef<Candidate>[] = [
    {
      header: (
        <Checkbox
          checked={allPageSelected}
          onCheckedChange={toggleAll}
          aria-label="Select all candidates on this page"
          disabled={reassignableCandidates.length === 0}
        />
      ),
      cell: ({ row }) => {
        const reassignable = isReassignable(row)
        return (
          <div title={reassignable ? undefined : 'Cannot reassign: exam is currently active'}>
            <Checkbox
              checked={selectedIds.has(row.id)}
              onCheckedChange={() => toggleOne(row.id)}
              aria-label={`Select ${getCandidateFullName(row)}`}
              disabled={!reassignable}
            />
          </div>
        )
      },
    },
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
        const statusStr = status as string | undefined
        const normalizedStatus = statusStr === 'ACTIVATE' ? 'ACTIVE' : status
        const getStatusBadgeProps = () => {
          switch (normalizedStatus) {
            case 'APPROVED':
              return { variant: 'default' as const, className: 'bg-green-500 text-white hover:bg-green-600 border-transparent' }
            case 'PENDING':
              return { variant: 'secondary' as const, className: 'bg-yellow-500 text-white hover:bg-yellow-600 border-transparent' }
            case 'REJECTED':
              return { variant: 'destructive' as const, className: 'bg-red-500 text-white hover:bg-red-600 border-transparent' }
            case 'SUBMITTED':
              return { variant: 'default' as const, className: 'bg-blue-500 text-white hover:bg-blue-600 border-transparent' }
            case 'ACTIVE':
              return { variant: 'default' as const, className: 'bg-emerald-500 text-white hover:bg-emerald-600 border-transparent' }
            default:
              return { variant: 'secondary' as const, className: 'border-transparent' }
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

  const selectedSession = sessions.find((s) => s.id === reassignSessionId)

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

      {/* Bulk-action bar — visible when candidates are selected */}
      {selectedIds.size > 0 && (
        <div className="flex items-center justify-between rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 no-print">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-primary">
              {selectedIds.size} candidate{selectedIds.size !== 1 ? 's' : ''} selected
            </span>
            <button
              type="button"
              className="text-xs text-muted-foreground underline hover:no-underline"
              onClick={clearSelection}
            >
              Clear selection
            </button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => void openReassignDialog()}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Re-assign Session
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => void openBulkDeleteDialog()}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Selected
            </Button>
          </div>
        </div>
      )}

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
                      if (pagination.page > 1) handlePageChange(pagination.page - 1)
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
                    const current = pagination.page
                    return (
                      page === 1 ||
                      page === pagination.totalPages ||
                      (page >= current - 1 && page <= current + 1)
                    )
                  })
                  .map((page, index, array) => {
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

      {/* Re-assign Session Dialog */}
      <Dialog
        open={showReassignDialog}
        onOpenChange={(open) => { if (!isReassigning) setShowReassignDialog(open) }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Re-assign Session
            </DialogTitle>
            <DialogDescription>
              Reassign {selectedIds.size} candidate{selectedIds.size !== 1 ? 's' : ''} to a
              different exam session. Candidates with an active running exam cannot be
              reassigned.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                Select Session <span className="text-red-500">*</span>
              </label>

              {sessionsLoading ? (
                <div className="flex items-center gap-2 py-3 text-sm text-muted-foreground">
                  <Spinner />
                  <span>Loading sessions…</span>
                </div>
              ) : sessions.length === 0 ? (
                <p className="text-sm text-muted-foreground py-2">
                  No exam sessions available.
                </p>
              ) : (
                <select
                  aria-label="Select exam session"
                  value={reassignSessionId}
                  onChange={(e) => setReassignSessionId(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Choose a session…</option>
                  {sessions.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                      {s.center ? ` — ${s.center.centerName}` : ''}
                      {' '}({s.status})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {selectedSession && (
              <div className="rounded-md border border-blue-200 bg-blue-50 p-3 text-xs text-blue-800 space-y-1">
                <p><strong>Session:</strong> {selectedSession.name}</p>
                <p><strong>Date:</strong> {new Date(selectedSession.date).toLocaleDateString()} at {selectedSession.time}</p>
                <p><strong>Duration:</strong> {selectedSession.duration} minutes</p>
                {selectedSession.center && (
                  <p><strong>Center:</strong> {selectedSession.center.centerName}</p>
                )}
              </div>
            )}

            <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
              <p className="font-semibold mb-1">
                {selectedIds.size} candidate{selectedIds.size !== 1 ? 's' : ''} will be reassigned
              </p>
              <p>
                Candidates currently sitting an active exam (ACTIVE status) are excluded from
                selection and will not be affected.
              </p>
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setShowReassignDialog(false)}
              disabled={isReassigning}
            >
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
            <Button
              onClick={() => void handleReassign()}
              disabled={isReassigning || !reassignSessionId || sessionsLoading}
            >
              {isReassigning ? (
                <>
                  <Spinner />
                  <span className="ml-2">Reassigning…</span>
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reassign {selectedIds.size} Candidate{selectedIds.size !== 1 ? 's' : ''}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Delete Dialog */}
      <Dialog
        open={showBulkDeleteDialog}
        onOpenChange={(open) => {
          if (!isBulkDeleting && !isBulkVerifying) {
            setShowBulkDeleteDialog(open)
            if (!open) setVerifiedBlockedIds(null)
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-destructive" />
              Delete Selected Candidates
            </DialogTitle>
            <DialogDescription>
              {isBulkVerifying
                ? 'Checking session history across all sessions…'
                : 'Review which candidates will be deleted and which will be skipped.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 mt-2">
            {/* Verifying */}
            {isBulkVerifying && (
              <div className="flex items-center gap-3 py-4 text-sm text-muted-foreground">
                <Spinner className="h-4 w-4" />
                Verifying {selectedIds.size} candidate{selectedIds.size !== 1 ? 's' : ''} against all session history…
              </div>
            )}

            {/* Results once verified */}
            {!isBulkVerifying && verifiedBlockedIds !== null && (
              <>
                {/* Will be deleted */}
                {verifiedDeletable.length > 0 && (
                  <div className="rounded-md border border-red-200 bg-red-50 p-3 space-y-2">
                    <p className="text-xs font-semibold text-red-800 uppercase tracking-wide">
                      Will be deleted ({verifiedDeletable.length})
                    </p>
                    <ul className="space-y-1 max-h-40 overflow-y-auto">
                      {verifiedDeletable.map((c) => (
                        <li key={c.id} className="text-sm text-red-800 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                          {getCandidateFullName(c)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Will be skipped */}
                {verifiedSkipped.length > 0 && (
                  <div className="rounded-md border border-amber-200 bg-amber-50 p-3 space-y-2">
                    <p className="text-xs font-semibold text-amber-800 uppercase tracking-wide">
                      Skipped — has active or submitted session ({verifiedSkipped.length})
                    </p>
                    <ul className="space-y-1 max-h-32 overflow-y-auto">
                      {verifiedSkipped.map((c) => (
                        <li key={c.id} className="text-sm text-amber-800 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                          {getCandidateFullName(c)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Nothing deletable */}
                {verifiedDeletable.length === 0 && (
                  <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                    All selected candidates have an active or submitted session and cannot be deleted.
                  </div>
                )}
              </>
            )}
          </div>

          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => { setShowBulkDeleteDialog(false); setVerifiedBlockedIds(null) }}
              disabled={isBulkDeleting || isBulkVerifying}
            >
              Cancel
            </Button>
            {!isBulkVerifying && verifiedDeletable.length > 0 && (
              <Button
                variant="destructive"
                onClick={() => void handleBulkDelete()}
                disabled={isBulkDeleting}
              >
                {isBulkDeleting ? (
                  <>
                    <Spinner />
                    <span className="ml-2">Deleting…</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete {verifiedDeletable.length} Candidate{verifiedDeletable.length !== 1 ? 's' : ''}
                  </>
                )}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
