'use client'

import { useCallback, useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useCandidatesProgressQuery } from '@/entities/monitoring'
import type { SessionMonitoringDetails } from '@/entities/monitoring'
import { queryKeys } from '@/shared/api/queryKeys'
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
  const { data: progressData, refetch: refetchProgress } = useCandidatesProgressQuery(sessionId)

  const applyProgress = useCallback(
    (data: Array<{ candidateId: string; totalQuestions: number; totalAttempted: number }>) => {
      if (!sessionId) return

      // Keep the ref up to date so future detail refetches can re-apply.
      for (const p of data) {
        progressRef.current.set(p.candidateId, {
          attempted: p.totalAttempted,
          totalQuestions: p.totalQuestions,
        })
      }

      queryClient.setQueryData<SessionMonitoringDetails>(
        queryKeys.monitoringSession(sessionId),
        (oldData) => {
          if (!oldData) return oldData

          const progressMap = new Map(data.map((p) => [p.candidateId, p]))

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
    },
    [sessionId, queryClient, progressRef]
  )

  useEffect(() => {
    if (!sessionId || !progressData) return
    applyProgress(progressData)
  }, [sessionId, progressData, applyProgress])

  const syncCandidatesProgress = useCallback(async () => {
    if (!sessionId) return
    try {
      const result = await refetchProgress()
      applyProgress(result.data ?? [])
    } catch (error) {
      console.error('[useMonitoringData] Failed to sync progress', error)
    }
  }, [sessionId, refetchProgress, applyProgress])

  return { syncCandidatesProgress }
}
