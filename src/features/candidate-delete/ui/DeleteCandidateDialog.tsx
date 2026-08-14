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
import { BlockedCandidateNotice } from './BlockedCandidateNotice'
import { CandidateSummary } from './CandidateSummary'
import { VerifyingStatus } from './VerifyingStatus'

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

          {verifyState === 'verifying' && <VerifyingStatus />}

          {verifyState === 'blocked' && candidateToDelete && (
            <div className="space-y-3">
              <CandidateSummary fullName={fullName} email={candidateToDelete.email} />
              <BlockedCandidateNotice fullName={fullName} />
            </div>
          )}

          {verifyState === 'ready' && candidateToDelete && (
            <>
              {error && <Alert variant="destructive">{error}</Alert>}
              <CandidateSummary fullName={fullName} email={candidateToDelete.email} />
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
