import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect } from 'react'
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
import type { CandidateLoginEvent, CandidateLogoutEvent, ExamStartedEvent, ExamAnswerSubmittedEvent } from '@/shared/lib/socket'
import { useSocket } from '@/shared/hooks/useSocket'
import type { TimerUpdateEvent, TimerStateEvent } from '@/shared/lib/socket/socket-events'

/**
 * Custom hook for fetching monitoring data with computed statistics
 * Uses the new monitoring API endpoints
 */
export function useMonitoringData(sessionId?: string) {
  const queryClient = useQueryClient()
  const { socket } = useSocket()

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
    refetchOnWindowFocus: false,
  })

  const {
    data: sessionDetails,
    isLoading: isLoadingDetails,
    error: detailsError,
    refetch: refetchDetails,
  } = useQuery({
    queryKey: ['monitoring', 'session', sessionId, 'details'],
    queryFn: () => getSessionDetails(sessionId!),
    enabled: Boolean(sessionId),
    staleTime: 0,
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    if (!sessionId) return
    socket?.emit('subscribe:session', sessionId)
    socket?.emit('timer:requestSnapshot', sessionId)
    return () => {
      socket?.emit('unsubscribe:session', sessionId)
    }
  }, [sessionId, socket])

  useEffect(() => {
    if (sessionId && sessionDetails) {
      getCandidatesProgress(sessionId)
        .then((progressData) => {
          queryClient.setQueryData<SessionMonitoringDetails>(
            ['monitoring', 'session', sessionId, 'details'],
            (oldData) => {
              if (!oldData) return oldData
              const progressMap = new Map(
                progressData.map(p => [p.candidateId, p])
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
        })
        .catch((error) => {
          void error
        })
    }
  }, [sessionId, sessionDetails, queryClient])

  const controlMutation = useMutation({
    mutationFn: ({ action, reason }: SessionControlRequest) =>
      controlSession(sessionId!, { action, reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['monitoring', 'session', sessionId] })
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
          queryClient.invalidateQueries({ queryKey: ['monitoring', 'session', sessionId, 'statistics'] })
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
          queryClient.invalidateQueries({ queryKey: ['monitoring', 'session', sessionId, 'details'] })
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

    queryClient.invalidateQueries({ queryKey: ['monitoring', 'session', sessionId, 'statistics'], exact: true })
    queryClient.invalidateQueries({ queryKey: ['monitoring', 'session', sessionId, 'details'], exact: true })
  }, [sessionId, queryClient])

  const handleCandidateLogout = useCallback((data: CandidateLogoutEvent) => {
    if (data.sessionId !== sessionId) {
      return
    }

    queryClient.setQueryData<SessionMonitoringStats>(
      ['monitoring', 'session', sessionId, 'statistics'],
      (oldData) => {
        if (!oldData) {
          queryClient.invalidateQueries({ queryKey: ['monitoring', 'session', sessionId, 'statistics'] })
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
          queryClient.invalidateQueries({ queryKey: ['monitoring', 'session', sessionId, 'details'] })
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

    queryClient.invalidateQueries({ queryKey: ['monitoring', 'session', sessionId, 'statistics'], exact: true })
    queryClient.invalidateQueries({ queryKey: ['monitoring', 'session', sessionId, 'details'], exact: true })
  }, [sessionId, queryClient])

  const handleExamStarted = useCallback((data: ExamStartedEvent) => {
    if (data.sessionId !== sessionId) {
      return
    }

    queryClient.setQueryData<SessionMonitoringDetails>(
      ['monitoring', 'session', sessionId, 'details'],
      (oldData) => {
        if (!oldData) {
          queryClient.invalidateQueries({ queryKey: ['monitoring', 'session', sessionId, 'details'] })
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

    queryClient.setQueryData<SessionMonitoringDetails>(
      ['monitoring', 'session', sessionId, 'details'],
      (oldData) => {
        if (!oldData) {
          queryClient.invalidateQueries({ queryKey: ['monitoring', 'session', sessionId, 'details'] })
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

  useSocketEvent('candidate:login', handleCandidateLogin)
  useSocketEvent('candidate:logout', handleCandidateLogout)
  useSocketEvent('exam:started', handleExamStarted)
  useSocketEvent('exam:answerSubmitted', handleAnswerSubmitted)

  useSocketEvent('timer:update', (data: TimerUpdateEvent) => {
    if (!sessionId || data.sessionId !== sessionId) return
  })
  const onTimerState = (data: TimerStateEvent) => {
    if (!sessionId || data.sessionId !== sessionId) return
  }
  useSocketEvent('timer:started', onTimerState)
  useSocketEvent('timer:paused', onTimerState)
  useSocketEvent('timer:resumed', onTimerState)
  useSocketEvent('timer:stopped', onTimerState)

  const refetch = () => {
    refetchStats()
    if (sessionDetails) {
      refetchDetails()
    }
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
