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
import { useReportPrint } from '../model/useReportPrint'
import { ReportExportPanel } from './ReportExportPanel'

interface PrintReportDialogProps {
  open: boolean
  onClose: () => void
  sessionId: string | null
}

export function PrintReportDialog({ open, onClose, sessionId }: PrintReportDialogProps) {
  const { session, analysis, loading, error, refetch } = useReportPrint(sessionId)

  useEffect(() => {
    if (open && sessionId) {
      refetch()
    }
  }, [open, sessionId, refetch])

  const isPDFReady = !loading && !error && session && analysis

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Download Report</DialogTitle>
          <DialogDescription>
            {session ? `Generate PDF report for ${session.name}` : 'Preparing report...'}
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
          <ReportExportPanel session={session} analysis={analysis} onClose={onClose} />
        )}
      </DialogContent>
    </Dialog>
  )
}
