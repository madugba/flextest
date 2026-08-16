'use client'

import { useQueryClient } from '@tanstack/react-query'
import {
  useControlSessionMutation as useEntityControlSessionMutation,
  type SessionControlRequest,
} from '@/entities/monitoring'
import { queryKeys } from '@/shared/api/queryKeys'
import { applyEndSessionSuccess } from './handlers/applyEndSessionSuccess'

interface UseControlSessionMutationArgs {
  sessionId?: string
  queryClient: ReturnType<typeof useQueryClient>
  sessionDurationSecondsRef: { current: number }
}

export function useControlSessionMutation({
  sessionId,
  queryClient,
  sessionDurationSecondsRef,
}: UseControlSessionMutationArgs) {
  const entityMutation = useEntityControlSessionMutation(sessionId ?? '')

  const controlSession = (request: SessionControlRequest) => {
    entityMutation.mutate(request, {
      onSuccess: async () => {
        if (!sessionId) return

        if (request.action === 'end') {
          // ── Exam ended ──────────────────────────────────────────────────────
          //
          // Flow:
          //   1. controlSession('end') → backend marks session COMPLETED and
          //      emits `session:update: COMPLETED` to every connected candidate.
          //   2. Candidates show a 5-second countdown, then call submitExam().
          //   3. Backend marks each candidate SUBMITTED and emits
          //      `candidate:update { status: 'SUBMITTED' }` to the examiner room.
          //   4. handleCandidateUpdate (above) picks that up and updates the
          //      monitoring table in real-time — no polling needed.
          //
          // We must NOT call bulkLogoutCandidates here: that would emit
          // `candidate:logout` which (a) kicks candidates to /login before they
          // can self-submit and (b) overwrites their status to PENDING in
          // handleCandidateLogout, undoing the SUBMITTED update.

          applyEndSessionSuccess(queryClient, sessionId)
        } else {
          // ── All other actions (start / pause / resume) ───────────────────────
          void queryClient.invalidateQueries({ queryKey: queryKeys.monitoringSession(sessionId) })
        }

        // Map session control action → timer API action
        const timerAction = request.action === 'end' ? 'stop' : request.action

        const body: Record<string, unknown> = { action: timerAction }
        if (timerAction === 'start') {
          // Add a 30-minute admin buffer on top of the session's original duration.
          // This gives candidates time to settle before the exam clock begins counting down.
          body.durationSeconds = sessionDurationSecondsRef.current + 30 * 60
        }

        // Await the timer update so Redis is written BEFORE we invalidate the
        // timer query — otherwise the refetch races and reads the old status.
        try {
          await fetch(`/api/timer/${sessionId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          })
        } catch (err) {
          console.error('[useMonitoringData] timer sync failed:', err)
        }

        // Invalidate AFTER Redis is updated so useTimer reads the new status.
        void queryClient.invalidateQueries({ queryKey: ['timer', sessionId] })
      },
    })
  }

  return {
    controlSession,
    isControlling: entityMutation.isPending,
    controlError: entityMutation.error,
  }
}
