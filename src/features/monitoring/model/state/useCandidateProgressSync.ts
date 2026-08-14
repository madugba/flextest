import { useCallback, useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { getCandidatesProgress } from '@/entities/monitoring'
import type { SessionMonitoringDetails } from '@/entities/monitoring'
import type { CandidateProgressRef } from './CandidateProgressRef'

interface UseCandidateProgressSyncArgs {
  sessionId?: string
  queryClient: ReturnType<typeof useQueryClient>
  progressRef: CandidateProgressRef
}

export function useCandidateProgressSync({
  sessionId,
  queryClient,
  progressRef,
}: UseCandidateProgressSyncArgs) {
  const progressSeedRef = useRef<string | null>(null)

  const syncCandidatesProgress = useCallback(async () => {
    if (!sessionId) return
    try {
      const progressData = await getCandidatesProgress(sessionId)

      // Keep the ref up to date so future detail refetches can re-apply.
      for (const p of progressData) {
        progressRef.current.set(p.candidateId, {
          attempted: p.totalAttempted,
          totalQuestions: p.totalQuestions,
        })
      }

      queryClient.setQueryData<SessionMonitoringDetails>(
        ['monitoring', 'session', sessionId, 'details'],
        (oldData) => {
          if (!oldData) return oldData

          const progressMap = new Map(progressData.map((p) => [p.candidateId, p]))

          const updatedCandidates = oldData.candidates.map((candidate) => {
            const progress = progressMap.get(candidate.id)
            if (progress) {
              return {
                ...candidate,
                totalQuestions: progress.totalQuestions,
                attempted: progress.totalAttempted,
              }
            }
            return candidate
          })

          return {
            ...oldData,
            candidates: updatedCandidates,
          }
        }
      )
    } catch (error) {
      console.error('[useMonitoringData] Failed to sync progress', error)
    }
  }, [sessionId, queryClient, progressRef])

  useEffect(() => {
    if (!sessionId || progressSeedRef.current === sessionId) {
      return
    }
    progressSeedRef.current = sessionId
    void syncCandidatesProgress()

    return () => {
      if (progressSeedRef.current === sessionId) {
        progressSeedRef.current = null
      }
    }
  }, [sessionId, syncCandidatesProgress])

  return { syncCandidatesProgress }
}
