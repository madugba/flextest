'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import { Alert } from '@/shared/ui/Alert'
import { Loader2 } from 'lucide-react'
import { useUploadResultsWizard } from '../model/useUploadResultsWizard'
import { PushProgressView } from './PushProgressView'
import { PushSummaryView } from './PushSummaryView'
import { UploadSteps } from './UploadSteps'
import { UploadDialogFooter } from './UploadDialogFooter'

interface UploadResultsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sessionId: string | null
}

export function UploadResultsDialog({ open, onOpenChange, sessionId }: UploadResultsDialogProps) {
  const wizard = useUploadResultsWizard(open, sessionId, () => onOpenChange(false))

  return (
    <Dialog open={open} onOpenChange={(next) => (next ? onOpenChange(true) : wizard.handleClose())}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Upload Results</DialogTitle>
          <DialogDescription>Push this session&apos;s scores to an external system</DialogDescription>
        </DialogHeader>

        {wizard.scoresError && <Alert variant="destructive">{wizard.scoresError}</Alert>}

        {wizard.isLoadingScores ? (
          <div className="flex items-center gap-2 py-6 text-sm text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading session scores…
          </div>
        ) : wizard.scorePush.status === 'pushing' ? (
          <PushProgressView progress={wizard.scorePush.progress} />
        ) : wizard.scorePush.status === 'done' ? (
          <PushSummaryView results={wizard.scorePush.results} />
        ) : (
          <UploadSteps wizard={wizard} />
        )}

        <UploadDialogFooter wizard={wizard} />
      </DialogContent>
    </Dialog>
  )
}
