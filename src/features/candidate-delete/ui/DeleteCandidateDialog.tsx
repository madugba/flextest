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
import type { Candidate } from '@/entities/candidate'
import { useDeleteCandidate } from '../model/useDeleteCandidate'
import { getCandidateFullName } from '@/entities/candidate'

interface DeleteCandidateDialogProps {
  onSuccess?: () => void
  children: (props: { onDelete: (candidate: Candidate) => void }) => React.ReactNode
}

export function DeleteCandidateDialog({ onSuccess, children }: DeleteCandidateDialogProps) {
  const {
    isOpen,
    isLoading,
    error,
    candidateToDelete,
    handleOpen,
    handleClose,
    handleConfirm,
  } = useDeleteCandidate(onSuccess)

  return (
    <>
      {children({ onDelete: handleOpen })}
      <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Candidate</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this candidate? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {error && <Alert variant="destructive">{error}</Alert>}

          {candidateToDelete && (
            <div className="rounded-md bg-muted p-4">
              <p className="text-sm font-medium">{getCandidateFullName(candidateToDelete)}</p>
              <p className="text-sm text-muted-foreground">{candidateToDelete.email}</p>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirm} disabled={isLoading}>
              {isLoading ? 'Deleting...' : 'Delete Candidate'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
