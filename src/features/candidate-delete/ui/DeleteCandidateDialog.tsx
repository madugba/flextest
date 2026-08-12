'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import { Button } from '@/shared/ui/Button'
import { Alert } from '@/shared/ui/Alert'
import { Spinner } from '@/shared/ui/Spinner'
import type { Candidate } from '@/entities/candidate'
import { useDeleteCandidate } from '../model/useDeleteCandidate'
import { getCandidateFullName } from '@/entities/candidate'
import { ShieldAlert } from 'lucide-react'

interface DeleteCandidateDialogProps {
  onSuccess?: () => void
  children: (props: { onDelete: (candidate: Candidate) => void }) => React.ReactNode
}

export function DeleteCandidateDialog({ onSuccess, children }: DeleteCandidateDialogProps) {
  const {
    isOpen,
    isLoading,
    verifyState,
    error,
    candidateToDelete,
    handleOpen,
    handleClose,
    handleConfirm,
  } = useDeleteCandidate(onSuccess)

  const fullName = candidateToDelete ? getCandidateFullName(candidateToDelete) : ''

  return (
    <>
      {children({ onDelete: handleOpen })}

      <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Candidate</DialogTitle>
            <DialogDescription>
              {verifyState === 'blocked'
                ? 'This candidate cannot be deleted.'
                : 'This action cannot be undone.'}
            </DialogDescription>
          </DialogHeader>

          {/* Verifying */}
          {verifyState === 'verifying' && (
            <div className="flex items-center gap-3 py-4 text-sm text-muted-foreground">
              <Spinner className="h-4 w-4" />
              Checking session status…
            </div>
          )}

          {/* Blocked */}
          {verifyState === 'blocked' && candidateToDelete && (
            <div className="space-y-3">
              <div className="rounded-md bg-muted p-4">
                <p className="text-sm font-medium">{fullName}</p>
                <p className="text-sm text-muted-foreground">{candidateToDelete.email}</p>
              </div>
              <div className="flex gap-2.5 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                <ShieldAlert className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-500" />
                <p>
                  <strong>{fullName}</strong> has an active or submitted exam session in the system
                  and cannot be deleted. This includes sessions they may have been previously
                  assigned to, even if they have since been re-assigned.
                </p>
              </div>
            </div>
          )}

          {/* Ready to delete */}
          {verifyState === 'ready' && candidateToDelete && (
            <>
              {error && <Alert variant="destructive">{error}</Alert>}
              <div className="rounded-md bg-muted p-4">
                <p className="text-sm font-medium">{fullName}</p>
                <p className="text-sm text-muted-foreground">{candidateToDelete.email}</p>
              </div>
            </>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={handleClose} disabled={isLoading}>
              {verifyState === 'blocked' ? 'Close' : 'Cancel'}
            </Button>
            {verifyState === 'ready' && (
              <Button variant="destructive" onClick={handleConfirm} disabled={isLoading}>
                {isLoading ? 'Deleting…' : 'Delete Candidate'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
