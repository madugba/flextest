'use client'

import { useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import { useReportAnalysis } from '../model/useReportAnalysis'
import { AnalysisSummaryCards } from './AnalysisSummaryCards'
import { ScoreDistributionChart } from './ScoreDistributionChart'
import { PassFailChart } from './PassFailChart'
import { TopScorers } from './TopScorers'
import { SubjectPerformanceTable } from './SubjectPerformanceTable'
import { AnalysisLoadingState } from './AnalysisLoadingState'
import { AnalysisErrorState } from './AnalysisErrorState'

interface AnalysisDialogProps {
  open: boolean
  onClose: () => void
  sessionId: string | null
}

export function AnalysisDialog({ open, onClose, sessionId }: AnalysisDialogProps) {
  const { analysis, loading, error, refetch } = useReportAnalysis(sessionId)

  useEffect(() => {
    if (open && sessionId) {
      refetch()
    }
  }, [open, sessionId, refetch])

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Session Analysis</DialogTitle>
          <DialogDescription>
            {analysis ? analysis.sessionName : 'Loading session analysis...'}
          </DialogDescription>
        </DialogHeader>

        {loading && <AnalysisLoadingState />}

        {error && <AnalysisErrorState error={error} onRetry={refetch} />}

        {!loading && !error && analysis && (
          <div className="space-y-6">
            <AnalysisSummaryCards analysis={analysis} />
            <ScoreDistributionChart analysis={analysis} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PassFailChart analysis={analysis} />
              <TopScorers analysis={analysis} />
            </div>
            {analysis.subjectWisePerformance.length > 0 && (
              <SubjectPerformanceTable analysis={analysis} />
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
