'use client'

import { useCallback, useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import type { SessionMonitoringDetails } from '@/entities/monitoring'
import { queryKeys } from '@/shared/api/queryKeys'
import type { CandidateProgressRef } from './CandidateProgressRef'

interface UseProgressPatchArgs {
  sessionId?: string
  queryClient: ReturnType<typeof useQueryClient>
  progressRef: CandidateProgressRef
  isFetchingDetails: boolean
}

export function useProgressPatch({
  sessionId,
  queryClient,
  progressRef,
  isFetchingDetails,
}: UseProgressPatchArgs) {
  const prevIsFetchingDetailsRef = useRef(false)

  // Apply the latest known progress back to the details cache. Called after
  // every details refetch to restore values the refetch would wipe.
  const patchProgressFromRef = useCallback(() => {
    if (!sessionId || progressRef.current.size === 0) return
    queryClient.setQueryData<SessionMonitoringDetails>(
      queryKeys.monitoringSession(sessionId),
      (oldData) => {
        if (!oldData) return oldData
        return {
          ...oldData,
          candidates: oldData.candidates.map((c) => {
            const prog = progressRef.current.get(c.id)
            if (prog) return { ...c, ...prog }
            return c
          }),
        }
      }
    )
  }, [sessionId, queryClient, progressRef])

  // Detect when a background details refetch completes and re-apply progress.
  // (The details endpoint doesn't return progress fields, so a refetch wipes them.)
  useEffect(() => {
    const justCompleted = prevIsFetchingDetailsRef.current && !isFetchingDetails
    prevIsFetchingDetailsRef.current = isFetchingDetails
    if (justCompleted) patchProgressFromRef()
  }, [isFetchingDetails, patchProgressFromRef])
}
