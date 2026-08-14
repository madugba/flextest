'use client'

import { useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import { Button } from '@/shared/ui/Button'
import { Alert } from '@/shared/ui/Alert'
import { Skeleton } from '@/shared/ui/skeleton'
import { useScoresPrint } from '../model/useScoresPrint'
import { ScoresExportPanel } from './ScoresExportPanel'

interface PrintScoresDialogProps {
  open: boolean
  onClose: () => void
  sessionId: string | null
}

export function PrintScoresDialog({ open, onClose, sessionId }: PrintScoresDialogProps) {
  const { session, scores, loading, error, refetch } = useScoresPrint(sessionId)

  useEffect(() => {
    if (open && sessionId) {
      refetch()
    }
  }, [open, sessionId, refetch])

  const isPDFReady = !loading && !error && session && scores

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Export Scores as PDF</DialogTitle>
          <DialogDescription>
            {session ? `Generate PDF scores report for ${session.name}` : 'Preparing scores...'}
          </DialogDescription>
        </DialogHeader>

        {loading && (
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        )}

        {error && (
          <div className="space-y-4">
            <Alert variant="destructive">{error}</Alert>
            <Button onClick={refetch} variant="outline" className="w-full">
              Retry
            </Button>
          </div>
        )}

        {isPDFReady && (
          <ScoresExportPanel session={session} scores={scores} onClose={onClose} />
        )}
      </DialogContent>
    </Dialog>
  )
}
