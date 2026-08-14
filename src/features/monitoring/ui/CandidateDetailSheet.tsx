import { Badge } from '@/shared/ui/Badge'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/shared/ui/sheet'
import type { MonitoringCandidate } from '@/entities/monitoring'
import { formatCandidateForDisplay } from '../model/selectors/formatCandidateForDisplay'
import { getStatusColor } from '../model/selectors/getStatusColor'
import { BookOpen, Clock, Hash, Loader2, Monitor, RefreshCw, Timer } from 'lucide-react'

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
    ? candidates.find(c => c.id === viewingCandidateId) ?? null
    : null
  const candidate = rawCandidate ? formatCandidateForDisplay(rawCandidate) : null

  const progressPct = candidate && rawCandidate
    ? rawCandidate.totalQuestions && rawCandidate.totalQuestions > 0
      ? Math.round((rawCandidate.attempted ?? 0) / rawCandidate.totalQuestions * 100)
      : 0
    : 0

  const lastActivity = rawCandidate?.lastLoginAt
    ? new Date(rawCandidate.lastLoginAt)
    : null
  const minutesAgo = lastActivity
    ? Math.floor((Date.now() - lastActivity.getTime()) / 60000)
    : null

  return (
    <Sheet open={!!viewingCandidateId} onOpenChange={(open) => { if (!open) onClose() }}>
      <SheetContent side="right" className="w-[420px] sm:max-w-[420px] flex flex-col gap-0 p-0">
        {candidate && rawCandidate ? (
          <>
            {/* Header */}
            <SheetHeader className="px-6 pt-6 pb-4 border-b">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-base font-semibold">{candidate.initials}</span>
                </div>
                <div className="min-w-0">
                  <SheetTitle className="text-base leading-tight">{candidate.name}</SheetTitle>
                  <SheetDescription className="text-xs mt-0.5">
                    Reg # {candidate.registrationNumber}
                    {rawCandidate.seatNumber ? ` · Seat ${rawCandidate.seatNumber}` : ''}
                  </SheetDescription>
                </div>
                <Badge className={`ml-auto shrink-0 border capitalize ${getStatusColor(candidate.status)}`}>
                  {candidate.status}
                </Badge>
              </div>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
              {/* Overall Progress */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Overall Progress</p>
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between items-baseline">
                    <span className="text-3xl font-bold text-gray-900">{progressPct}%</span>
                    <span className="text-sm text-gray-500">
                      {rawCandidate.attempted ?? 0} / {rawCandidate.totalQuestions ?? 0} questions
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all ${
                        progressPct >= 80 ? 'bg-green-500'
                        : progressPct >= 50 ? 'bg-blue-500'
                        : 'bg-orange-400'
                      }`}
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Subjects */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5" />
                  Subjects ({rawCandidate.subjects?.length ?? 0})
                </p>
                {rawCandidate.subjects && rawCandidate.subjects.length > 0 ? (
                  <div className="space-y-2">
                    {rawCandidate.subjects.map((subject, i) => {
                      const total = subjectQuestionCounts.get(subject.id) ?? null
                      return (
                        <div key={subject.id} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-100">
                          <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <span className="text-[10px] font-bold text-primary">{i + 1}</span>
                          </div>
                          <span className="text-sm font-medium text-gray-800 flex-1 truncate">{subject.name}</span>
                          {total !== null && (
                            <span className="text-xs text-gray-500 shrink-0 tabular-nums">
                              {total} questions
                            </span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 italic">No subjects assigned</p>
                )}
              </div>

              {/* Time & Activity */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                  <Timer className="h-3.5 w-3.5" />
                  Activity
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4 text-gray-400" />
                      Last seen
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {lastActivity
                        ? minutesAgo === 0
                          ? 'Just now'
                          : minutesAgo === 1
                          ? '1 min ago'
                          : `${minutesAgo} mins ago`
                        : '—'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Hash className="h-4 w-4 text-gray-400" />
                      Seat number
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {rawCandidate.seatNumber || '—'}
                    </span>
                  </div>
                  {candidate.clientInfo && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Monitor className="h-4 w-4 text-gray-400" />
                        Device
                      </div>
                      <span className="text-sm font-medium text-gray-900 text-right max-w-[180px] truncate" title={candidate.clientInfo}>
                        {candidate.clientInfo}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer note */}
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
