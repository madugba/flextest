import {
  Sheet,
  SheetContent,
  SheetHeader,
} from '@/shared/ui/sheet'
import type { MonitoringCandidate } from '@/entities/monitoring'
import { formatCandidateForDisplay } from '../model/selectors/formatCandidateForDisplay'
import { formatLastSeen } from '../model/selectors/formatLastSeen'
import { Loader2, RefreshCw } from 'lucide-react'
import { CandidateDetailHeader } from './CandidateDetailHeader'
import { CandidateProgressPanel } from './CandidateProgressPanel'
import { CandidateSubjectsPanel } from './CandidateSubjectsPanel'
import { CandidateActivityPanel } from './CandidateActivityPanel'

interface CandidateDetailSheetProps {
  viewingCandidateId: string | null
  candidates: MonitoringCandidate[]
  subjectQuestionCounts: Map<string, number>
  onClose: () => void
}

export function CandidateDetailSheet({
  viewingCandidateId,
  candidates,
  subjectQuestionCounts,
  onClose,
}: CandidateDetailSheetProps) {
  const rawCandidate = viewingCandidateId
    ? (candidates.find((c) => c.id === viewingCandidateId) ?? null)
    : null
  const candidate = rawCandidate ? formatCandidateForDisplay(rawCandidate) : null

  const progressPct =
    candidate && rawCandidate
      ? rawCandidate.totalQuestions && rawCandidate.totalQuestions > 0
        ? Math.round(((rawCandidate.attempted ?? 0) / rawCandidate.totalQuestions) * 100)
        : 0
      : 0

  const lastSeenLabel = formatLastSeen(rawCandidate?.lastLoginAt)

  return (
    <Sheet open={!!viewingCandidateId} onOpenChange={(open) => { if (!open) onClose() }}>
      <SheetContent side="right" className="w-[420px] sm:max-w-[420px] flex flex-col gap-0 p-0">
        {candidate && rawCandidate ? (
          <>
            <SheetHeader className="px-6 pt-6 pb-4 border-b">
              <CandidateDetailHeader candidate={candidate} rawCandidate={rawCandidate} />
            </SheetHeader>

            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
              <CandidateProgressPanel
                progressPct={progressPct}
                attempted={rawCandidate.attempted ?? 0}
                totalQuestions={rawCandidate.totalQuestions ?? 0}
              />

              <CandidateSubjectsPanel
                subjects={rawCandidate.subjects}
                subjectQuestionCounts={subjectQuestionCounts}
              />

              <CandidateActivityPanel
                lastSeenLabel={lastSeenLabel}
                seatNumber={rawCandidate.seatNumber ?? null}
                clientInfo={candidate.clientInfo}
              />
            </div>

            <div className="px-6 py-3 border-t bg-gray-50 flex items-center gap-2 text-xs text-gray-400">
              <RefreshCw className="h-3 w-3" />
              Updates every time monitoring data refreshes
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center flex-1">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
