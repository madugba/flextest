'use client'

import { Button } from '@/shared/ui/Button'
import { DialogFooter } from '@/shared/ui/dialog'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { ScoresPDF } from './ScoresPDF'
import { Download, FileText } from 'lucide-react'
import type { ExamSession, SessionScores } from '@/entities/exam-session'

interface ScoresExportPanelProps {
  session: ExamSession
  scores: SessionScores
  onClose: () => void
}

export function ScoresExportPanel({ session, scores, onClose }: ScoresExportPanelProps) {
  return (
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
  )
}

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
