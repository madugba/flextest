'use client'

import { useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/shared/ui/dialog'
import { Button } from '@/shared/ui/Button'
import { Alert } from '@/shared/ui/Alert'
import { Skeleton } from '@/shared/ui/skeleton'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { useScoresPrint } from '../model/useScoresPrint'
import { ScoresPDF } from './ScoresPDF'
import { Download, FileText } from 'lucide-react'
import type { SessionScores } from '@/entities/exam-session'

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
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <FileText className="h-10 w-10 text-blue-600" />
                <div className="flex-1">
                  <h4 className="font-medium text-blue-900">Session Scores PDF</h4>
                  <p className="text-sm text-blue-700">{session.name}</p>
                  <p className="text-xs text-blue-600 mt-1">
                    {scores.candidates.length} candidate{scores.candidates.length !== 1 ? 's' : ''} •{' '}
                    {getSubjectCount(scores)} subject{getSubjectCount(scores) !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
                Cancel
              </Button>
              <PDFDownloadLink
                document={<ScoresPDF session={session} scores={scores} />}
                fileName={`${session.name.replace(/\s+/g, '_')}_Scores.pdf`}
                className="w-full sm:w-auto"
              >
                {({ loading: pdfLoading }) => (
                  <Button disabled={pdfLoading} className="w-full sm:w-auto">
                    <Download className="mr-2 h-4 w-4" />
                    {pdfLoading ? 'Generating PDF...' : 'Download PDF'}
                  </Button>
                )}
              </PDFDownloadLink>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

// Helper to get subject count (used in dialog)
function getSubjectCount(scores: SessionScores): number {
  if (!scores || !scores.candidates || scores.candidates.length === 0) return 0
  const allSubjects = new Set<string>()
  scores.candidates.forEach((candidate) => {
    candidate.subjects.forEach((subject) => {
      allSubjects.add(subject.subjectId)
    })
  })
  return allSubjects.size
}

