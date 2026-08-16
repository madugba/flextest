import type { QueryClient } from '@tanstack/react-query'
import type { SessionMonitoringDetails } from '@/entities/monitoring'
import type { CandidateStatus } from '@/entities/candidate'
import { queryKeys } from '@/shared/api/queryKeys'

export function applyEndSessionSuccess(queryClient: QueryClient, sessionId: string) {
  // Optimistic update — shows SUBMITTED immediately in the UI while
  // candidates are going through their 5-second countdown.
  queryClient.setQueryData<SessionMonitoringDetails>(
    queryKeys.monitoringSession(sessionId),
    (old) => {
      if (!old) return old
      return {
        ...old,
        candidates: old.candidates.map((c) =>
          c.status === 'ACTIVE'
            ? { ...c, status: 'SUBMITTED' as CandidateStatus }
            : c
        ),
      }
    }
  )

  // Refresh stats counts (active → submitted) but leave details alone
  // so the optimistic patch is not immediately overwritten.
  queryClient.invalidateQueries({
    queryKey: queryKeys.monitoringStatistics(sessionId),
  })

  // After candidates have had enough time to self-submit, do a full sync
  // to reconcile any candidates who were offline and couldn't receive the
  // session:update event.
  setTimeout(() => {
    queryClient.invalidateQueries({ queryKey: queryKeys.monitoringSession(sessionId) })
  }, 15_000)
}
