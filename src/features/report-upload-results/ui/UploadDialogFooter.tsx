import { Button } from '@/shared/ui/Button'
import { DialogFooter } from '@/shared/ui/dialog'
import type { UploadResultsWizard } from '../model/useUploadResultsWizard'

interface UploadDialogFooterProps {
  wizard: UploadResultsWizard
}

export function UploadDialogFooter({ wizard }: UploadDialogFooterProps) {
  const { scorePush, readyToReview, handleClose, handleConfirmPush, handleRetryFailed, handleDone } = wizard

  return (
    <DialogFooter>
      {scorePush.status === 'done' ? (
        <>
          {scorePush.progress.failed > 0 && (
            <Button variant="outline" onClick={handleRetryFailed}>
              Retry Failed ({scorePush.progress.failed})
            </Button>
          )}
          <Button onClick={handleDone}>Done</Button>
        </>
      ) : scorePush.status === 'pushing' ? (
        <Button variant="outline" disabled>Pushing…</Button>
      ) : (
        <>
          <Button variant="outline" onClick={handleClose}>Cancel</Button>
          <Button onClick={handleConfirmPush} disabled={!readyToReview}>
            Confirm &amp; Push
          </Button>
        </>
      )}
    </DialogFooter>
  )
}
