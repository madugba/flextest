'use client'

import { useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useMonitoringQueries } from './state/useMonitoringQueries'
import { useCandidateProgressSync } from './state/useCandidateProgressSync'
import { useProgressPatch } from './state/useProgressPatch'
import type { CandidateProgressRef } from './state/CandidateProgressRef'
import { useControlSessionMutation } from './useControlSessionMutation'
import { useMonitoringSocketHandlers } from './useMonitoringSocketHandlers'

/**
 * Custom hook for fetching monitoring data with computed statistics
 * Uses the new monitoring API endpoints
 */
export function useMonitoringData(sessionId?: string, autoRefresh = true) {
  const queryClient = useQueryClient()

  // Source of truth for candidate progress — survives details query refetches.
  // Updated by socket events and syncCandidatesProgress; applied back to the
  // cache whenever the details query refetches (which would otherwise wipe the
  // progress fields, since that endpoint doesn't return them).
  const progressRef: CandidateProgressRef = useRef(new Map())

  const {
    sessionStats,
    isLoadingStats,
    statsError,
    refetchStats,
    sessionDetails,
    isLoadingDetails,
    isFetchingDetails,
    detailsError,
    refetchDetails,
    sessionDurationSecondsRef,
  } = useMonitoringQueries({ sessionId, autoRefresh })

  const { syncCandidatesProgress } = useCandidateProgressSync({
    sessionId,
    queryClient,
    progressRef,
  })

  useProgressPatch({ sessionId, queryClient, progressRef, isFetchingDetails })

  const { controlSession, isControlling, controlError } = useControlSessionMutation({
    sessionId,
    queryClient,
    sessionDurationSecondsRef,
  })

  useMonitoringSocketHandlers({ sessionId, queryClient, progressRef })

  const refetch = () => {
    refetchStats()
    refetchDetails()
    void syncCandidatesProgress()
  }

  return {
    selectedSession: sessionStats
      ? {
          id: sessionStats.sessionId,
          name: sessionStats.sessionName,
          date: new Date(sessionStats.sessionDate),
          duration: sessionStats.sessionDuration,
          status: sessionStats.sessionStatus,
        }
      : null,

    stats: sessionStats?.statistics || {
      scheduled: 0,
      absent: 0,
      active: 0,
      submitted: 0,
    },

    remainingTime: sessionStats?.remainingTime || '00:00:00',

    candidates: sessionDetails?.candidates || [],

    isLoading: isLoadingStats,
    isLoadingStats,
    isLoadingDetails,

    error: statsError || detailsError,
    statsError,
    detailsError,

    refetch,
    refetchStats,
    refetchDetails,

    controlSession,
    isControlling,
    controlError,
  }
}
