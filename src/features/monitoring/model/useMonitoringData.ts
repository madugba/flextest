import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useRef } from 'react'
import {
  getSessionStatistics,
  getSessionDetails,
  controlSession,
  getCandidatesProgress,
  type SessionControlRequest,
  type SessionMonitoringStats,
  type SessionMonitoringDetails
} from '@/entities/monitoring'
import type { CandidateStatus } from '@/entities/candidate'
import { useSocketEvent } from '@/shared/hooks/useSocketEvent'
import type { CandidateLoginEvent, CandidateLogoutEvent, ExamStartedEvent, ExamAnswerSubmittedEvent, CandidateUpdateData } from '@/shared/lib/socket'
import { useSocket } from '@/shared/hooks/useSocket'

/**
 * Custom hook for fetching monitoring data with computed statistics
 * Uses the new monitoring API endpoints
 */
export function useMonitoringData(sessionId?: string, autoRefresh = true) {
  const queryClient = useQueryClient()
  const { socket, isConnected } = useSocket()

  // Captured on every render so the mutation's onSuccess callback sees the
  // latest sessionDuration without a stale closure.
  const sessionDurationSecondsRef = useRef(0)

  // Source of truth for candidate progress — survives details query refetches.
  // Updated by socket events and syncCandidatesProgress; applied back to the
  // cache whenever the details query refetches (which would otherwise wipe the
  // progress fields, since that endpoint doesn't return them).
  const progressRef = useRef<Map<string, { attempted: number; totalQuestions: number }>>(new Map())

  const {
    data: sessionStats,
    isLoading: isLoadingStats,
    error: statsError,
    refetch: refetchStats,
  } = useQuery({
    queryKey: ['monitoring', 'session', sessionId, 'statistics'],
    queryFn: () => getSessionStatistics(sessionId!),
    enabled: Boolean(sessionId),
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    // Auto-refresh stats counts (active/absent/submitted) on a timer.
    refetchInterval: autoRefresh ? 30_000 : (false as const),
  })

  const {
    data: sessionDetails,
    isLoading: isLoadingDetails,
    isFetching: isFetchingDetails,
    error: detailsError,
    refetch: refetchDetails,
  } = useQuery({
    queryKey: ['monitoring', 'session', sessionId, 'details'],
    queryFn: () => getSessionDetails(sessionId!),
    enabled: Boolean(sessionId),
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    // No refetchInterval — the details endpoint doesn't include progress.
    // Progress is kept live via socket events + syncCandidatesProgress.
  })

  const progressSeedRef = useRef<string | null>(null)
  const prevIsFetchingDetailsRef = useRef(false)

  // Apply the latest known progress back to the details cache.
  // Called after every details refetch to restore values the refetch would wipe.
  const patchProgressFromRef = useCallback(() => {
    if (!sessionId || progressRef.current.size === 0) return
    queryClient.setQueryData<SessionMonitoringDetails>(
      ['monitoring', 'session', sessionId, 'details'],
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
  }, [sessionId, queryClient])

  // Detect when a background details refetch completes and re-apply progress.
  // (The details endpoint doesn't return progress fields, so a refetch wipes them.)
  useEffect(() => {
    const justCompleted = prevIsFetchingDetailsRef.current && !isFetchingDetails
    prevIsFetchingDetailsRef.current = isFetchingDetails
    if (justCompleted) patchProgressFromRef()
  }, [isFetchingDetails, patchProgressFromRef])

  // Keep the duration ref current on every render
  if (sessionStats?.sessionDuration) {
    sessionDurationSecondsRef.current = sessionStats.sessionDuration * 60
  }

  useEffect(() => {
    if (!sessionId || !isConnected) return
    socket?.emit('subscribe:session', sessionId)
    return () => {
      socket?.emit('unsubscribe:session', sessionId)
    }
  }, [sessionId, socket, isConnected])

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

          const progressMap = new Map(
            progressData.map((p) => [p.candidateId, p])
          )

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
  }, [sessionId, queryClient])

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

  const controlMutation = useMutation({
    mutationFn: ({ action, reason }: SessionControlRequest) =>
      controlSession(sessionId!, { action, reason }),
    onSuccess: async (_, variables) => {
      if (!sessionId) return

      if (variables.action === 'end') {
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

        // Optimistic update — shows SUBMITTED immediately in the UI while
        // candidates are going through their 5-second countdown.
        queryClient.setQueryData<SessionMonitoringDetails>(
          ['monitoring', 'session', sessionId, 'details'],
          (old) => {
            if (!old) return old
            return {
              ...old,
              candidates: old.candidates.map(c =>
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
          queryKey: ['monitoring', 'session', sessionId, 'statistics'],
        })

        // After candidates have had enough time to self-submit, do a full sync
        // to reconcile any candidates who were offline and couldn't receive the
        // session:update event.
        setTimeout(() => {
          queryClient.invalidateQueries({ queryKey: ['monitoring', 'session', sessionId] })
        }, 15_000)
      } else {
        // ── All other actions (start / pause / resume) ───────────────────────
        queryClient.invalidateQueries({ queryKey: ['monitoring', 'session', sessionId] })
      }

      // Map session control action → timer API action
      const timerAction =
        variables.action === 'end' ? 'stop' : variables.action

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
      queryClient.invalidateQueries({ queryKey: ['timer', sessionId] })
    },
  })

  const handleCandidateLogin = useCallback((data: CandidateLoginEvent) => {
    if (data.sessionId !== sessionId) {
      return
    }

    queryClient.setQueryData<SessionMonitoringStats>(
      ['monitoring', 'session', sessionId, 'statistics'],
      (oldData) => {
        if (!oldData) {
          return oldData
        }
        return {
          ...oldData,
          statistics: {
            ...data.statistics,
          },
          timestamp: data.timestamp,
        }
      }
    )

    queryClient.setQueryData<SessionMonitoringDetails>(
      ['monitoring', 'session', sessionId, 'details'],
      (oldData) => {
        if (!oldData) {
          return oldData
        }
        const existingIndex = oldData.candidates.findIndex(c => c.id === data.candidate.id)

        let updatedCandidates: typeof oldData.candidates
        if (existingIndex >= 0) {
          updatedCandidates = oldData.candidates.map((c, idx) => {
            if (idx === existingIndex) {
              return {
                id: data.candidate.id,
                firstName: data.candidate.firstName,
                lastName: data.candidate.lastName,
                surname: data.candidate.surname ?? null,
                firstname: data.candidate.firstname ?? null,
                email: data.candidate.email ?? null,
                seatNumber: data.candidate.seatNumber,
                status: data.candidate.status as CandidateStatus,
                lastLoginAt: data.candidate.lastLoginAt ?? null,
                picture: data.candidate.picture ?? null,
                clientInfo: data.candidate.clientInfo,
                subjects: data.candidate.subjects || [],
              }
            }
            return c
          })
        } else {
          updatedCandidates = [
            ...oldData.candidates,
            {
              id: data.candidate.id,
              firstName: data.candidate.firstName,
              lastName: data.candidate.lastName,
              surname: data.candidate.surname ?? null,
              firstname: data.candidate.firstname ?? null,
              email: data.candidate.email ?? null,
              seatNumber: data.candidate.seatNumber,
              status: data.candidate.status as CandidateStatus,
              lastLoginAt: data.candidate.lastLoginAt ?? null,
              picture: data.candidate.picture ?? null,
              clientInfo: data.candidate.clientInfo,
              subjects: data.candidate.subjects || [],
            }
          ]
        }

        return {
          ...oldData,
          statistics: {
            ...data.statistics,
          },
          candidates: updatedCandidates,
          timestamp: data.timestamp,
        }
      }
    )
  }, [sessionId, queryClient])

  const handleCandidateLogout = useCallback((data: CandidateLogoutEvent) => {
    if (data.sessionId !== sessionId) {
      return
    }

    queryClient.setQueryData<SessionMonitoringStats>(
      ['monitoring', 'session', sessionId, 'statistics'],
      (oldData) => {
        if (!oldData) {
          return oldData
        }
        return {
          ...oldData,
          statistics: {
            ...data.statistics,
          },
          timestamp: data.timestamp,
        }
      }
    )

    queryClient.setQueryData<SessionMonitoringDetails>(
      ['monitoring', 'session', sessionId, 'details'],
      (oldData) => {
        if (!oldData) {
          return oldData
        }
        const updatedCandidates = oldData.candidates.map((c) => {
          if (c.id === data.candidateId) {
            return {
              ...c,
              status: 'PENDING' as CandidateStatus,
            }
          }
          return c
        })

        return {
          ...oldData,
          statistics: {
            ...data.statistics,
          },
          candidates: updatedCandidates,
          timestamp: data.timestamp,
        }
      }
    )
  }, [sessionId, queryClient])

  const handleExamStarted = useCallback((data: ExamStartedEvent) => {
    if (data.sessionId !== sessionId) {
      return
    }

    progressRef.current.set(data.candidateId, {
      attempted: data.totalAttempted,
      totalQuestions: data.totalQuestions,
    })

    queryClient.setQueryData<SessionMonitoringDetails>(
      ['monitoring', 'session', sessionId, 'details'],
      (oldData) => {
        if (!oldData) {
          return oldData
        }
        const updatedCandidates = oldData.candidates.map((c) => {
          if (c.id === data.candidateId) {
            return {
              ...c,
              totalQuestions: data.totalQuestions,
              attempted: data.totalAttempted,
            }
          }
          return c
        })

        return {
          ...oldData,
          candidates: updatedCandidates,
        }
      }
    )
  }, [sessionId, queryClient])

  const handleAnswerSubmitted = useCallback((data: ExamAnswerSubmittedEvent) => {
    if (data.sessionId !== sessionId) {
      return
    }

    progressRef.current.set(data.candidateId, {
      attempted: data.totalAttemptedQuestions,
      totalQuestions: data.totalQuestions,
    })

    queryClient.setQueryData<SessionMonitoringDetails>(
      ['monitoring', 'session', sessionId, 'details'],
      (oldData) => {
        if (!oldData) {
          return oldData
        }
        const updatedCandidates = oldData.candidates.map((c) => {
          if (c.id === data.candidateId) {
            return {
              ...c,
              totalQuestions: data.totalQuestions,
              attempted: data.totalAttemptedQuestions,
            }
          }
          return c
        })

        return {
          ...oldData,
          candidates: updatedCandidates,
        }
      }
    )
  }, [sessionId, queryClient])

  const handleCandidateUpdate = useCallback((data: CandidateUpdateData) => {
    if (data.sessionId && data.sessionId !== sessionId) return

    queryClient.setQueryData<SessionMonitoringDetails>(
      ['monitoring', 'session', sessionId, 'details'],
      (oldData) => {
        if (!oldData) return oldData
        return {
          ...oldData,
          candidates: oldData.candidates.map((c) =>
            c.id === data.candidateId
              ? { ...c, status: data.status as CandidateStatus }
              : c
          ),
        }
      }
    )

    // Refetch stats so submitted/active counts update immediately
    void queryClient.invalidateQueries({
      queryKey: ['monitoring', 'session', sessionId, 'statistics'],
    })
  }, [sessionId, queryClient])

  useSocketEvent('candidate:login', handleCandidateLogin)
  useSocketEvent('candidate:logout', handleCandidateLogout)
  useSocketEvent('exam:started', handleExamStarted)
  useSocketEvent('exam:answerSubmitted', handleAnswerSubmitted)
  useSocketEvent('candidate:update', handleCandidateUpdate)

  const refetch = () => {
    refetchStats()
    refetchDetails()
    void syncCandidatesProgress()
  }

  return {
    selectedSession: sessionStats ? {
      id: sessionStats.sessionId,
      name: sessionStats.sessionName,
      date: new Date(sessionStats.sessionDate),
      duration: sessionStats.sessionDuration,
      status: sessionStats.sessionStatus,
    } : null,

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

    controlSession: controlMutation.mutate,
    isControlling: controlMutation.isPending,
    controlError: controlMutation.error,
  }
}
