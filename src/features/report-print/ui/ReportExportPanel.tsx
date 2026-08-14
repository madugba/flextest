'use client'

import { Button } from '@/shared/ui/Button'
import { DialogFooter } from '@/shared/ui/dialog'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { SessionReportPDF } from './ReportPDF'
import { Download, FileText } from 'lucide-react'
import type { ExamSession, SessionAnalysis } from '@/entities/exam-session'

interface ReportExportPanelProps {
  session: ExamSession
  analysis: SessionAnalysis
  onClose: () => void
}

export function ReportExportPanel({ session, analysis, onClose }: ReportExportPanelProps) {
  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <FileText className="h-10 w-10 text-blue-600" />
          <div className="flex-1">
            <h4 className="font-medium text-blue-900">Exam Report PDF</h4>
            <p className="text-sm text-blue-700">{session.name}</p>
            <p className="text-xs text-blue-600 mt-1">
              {analysis.submittedCount} candidates • {analysis.passingTrend.passPercentage.toFixed(1)}% pass rate
            </p>
          </div>
        </div>
      </div>

      <DialogFooter className="flex-col sm:flex-row gap-2">
        <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
          Cancel
        </Button>
        <PDFDownloadLink
          document={<SessionReportPDF session={session} analysis={analysis} />}
          fileName={`${session.name.replace(/\s+/g, '_')}_Report.pdf`}
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
