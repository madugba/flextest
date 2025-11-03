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

/**
 * Custom hook for fetching monitoring data with computed statistics
 * Uses the new monitoring API endpoints
 */
export function useMonitoringData(sessionId?: string) {
  const queryClient = useQueryClient()
  useSocket()

  // Debug: Log when hook initializes
  console.log('[useMonitoringData] Hook initialized with sessionId:', sessionId)

  // Fetch session statistics (lightweight, fast)
  // Initial load via HTTP, then real-time updates via WebSocket

  const {
    data: sessionStats,
    isLoading: isLoadingStats,
    error: statsError,
    refetch: refetchStats,
  } = useQuery({
    queryKey: ['monitoring', 'session', sessionId, 'statistics'],
    queryFn: () => getSessionStatistics(sessionId!),
    enabled: !!sessionId,
    staleTime: 0, // Always consider stale to enable polling
    // refetchInterval: 5000, // Poll every 3 seconds
    refetchOnWindowFocus: false, // Also refresh when returning to tab
  })

  // Fetch session details with candidates (initial load via HTTP)
  const {
    data: sessionDetails,
    isLoading: isLoadingDetails,
    error: detailsError,
    refetch: refetchDetails,
  } = useQuery({
    queryKey: ['monitoring', 'session', sessionId, 'details'],
    queryFn: () => getSessionDetails(sessionId!),
    enabled: !!sessionId, // Fetch on mount and when sessionId changes
    staleTime: 0, // Always consider stale to enable polling
    // refetchInterval: 5000, // Poll every 3 seconds
    refetchOnWindowFocus: false, // Also refresh when returning to tab
  })

  // Fetch candidates progress on mount and refresh
  // This syncs the exam progress for all candidates when the page loads
  useEffect(() => {
    if (sessionId && sessionDetails) {
      getCandidatesProgress(sessionId)
        .then((progressData) => {
          console.log('[useMonitoringData] 📊 Fetched candidates progress:', progressData)

          // Update the cache with progress data
          queryClient.setQueryData<SessionMonitoringDetails>(
            ['monitoring', 'session', sessionId, 'details'],
            (oldData) => {
              if (!oldData) return oldData

              // Create a map for quick lookup
              const progressMap = new Map(
                progressData.map(p => [p.candidateId, p])
              )

              // Update candidates with their progress
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
          console.error('[useMonitoringData] Failed to fetch candidates progress:', error)
        })
    }
  }, [sessionId, sessionDetails, queryClient])

  // No room subscription needed: backend emits candidate:login globally

  // Session control mutation (start, pause, resume, end)
  const controlMutation = useMutation({
    mutationFn: ({ action, reason }: SessionControlRequest) =>
      controlSession(sessionId!, { action, reason }),
    onSuccess: () => {
      // Invalidate and refetch monitoring data
      queryClient.invalidateQueries({ queryKey: ['monitoring', 'session', sessionId] })
    },
  })

  // Listen to candidate:login WebSocket events for real-time updates
  // This provides zero-latency updates by directly updating the cache
  const handleCandidateLogin = useCallback((data: CandidateLoginEvent) => {
    console.log('[useMonitoringData] 🎯 candidate:login event received:', {
      candidateId: data.candidateId,
      candidateName: data.candidateName,
      sessionId: data.sessionId,
      currentSessionId: sessionId,
      statistics: data.statistics,
      hasCandidate: !!data.candidate,
      timestamp: data.timestamp,
    })

    // Only update if the event is for the current session
    if (data.sessionId !== sessionId) {
      console.log('[useMonitoringData] ⚠️ Event ignored - different session', {
        eventSession: data.sessionId,
        currentSession: sessionId
      })
      return
    }

    console.log('[useMonitoringData] ✅ Processing candidate login event for current session')

    // 1. Update statistics in cache
    queryClient.setQueryData<SessionMonitoringStats>(
      ['monitoring', 'session', sessionId, 'statistics'],
      (oldData) => {
        if (!oldData) {
          console.log('[useMonitoringData] ⚠️ No statistics cache - triggering refetch')
          // Trigger refetch if cache is empty
          queryClient.invalidateQueries({ queryKey: ['monitoring', 'session', sessionId, 'statistics'] })
          return oldData
        }

        console.log('[useMonitoringData] 📊 Updating statistics cache:', {
          old: oldData.statistics,
          new: data.statistics
        })

        // Create new object to ensure React Query detects the change
        return {
          ...oldData,
          statistics: {
            ...data.statistics,
          },
          timestamp: data.timestamp,
        }
      }
    )

    // 2. Update candidate list in cache (zero-latency update, no HTTP request)
    queryClient.setQueryData<SessionMonitoringDetails>(
      ['monitoring', 'session', sessionId, 'details'],
      (oldData) => {
        if (!oldData) {
          console.log('[useMonitoringData] ⚠️ No details cache - triggering refetch')
          // Trigger refetch if cache is empty
          queryClient.invalidateQueries({ queryKey: ['monitoring', 'session', sessionId, 'details'] })
          return oldData
        }

        console.log('[useMonitoringData] 👥 Updating candidate list cache:', {
          totalCandidates: oldData.candidates.length,
          candidateId: data.candidate.id,
          candidateName: data.candidateName
        })

        // Check if candidate already exists in the list
        const existingIndex = oldData.candidates.findIndex(c => c.id === data.candidate.id)

        let updatedCandidates: typeof oldData.candidates
        if (existingIndex >= 0) {
          // Update existing candidate - create new array and new candidate object
          console.log('[useMonitoringData] 🔄 Updating existing candidate at index:', existingIndex)
          updatedCandidates = oldData.candidates.map((c, idx) => {
            if (idx === existingIndex) {
              // Return new candidate object with all fields
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
          // Add new candidate - create new array
          console.log('[useMonitoringData] ➕ Adding new candidate to list')
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

        console.log('[useMonitoringData] ✅ Candidate list cache updated successfully', {
          newCandidateCount: updatedCandidates.length,
          updatedCandidateId: data.candidate.id
        })

        // Create new object to ensure React Query detects the change
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

    // Schedule a lightweight refetch to reconcile with server truth
    queryClient.invalidateQueries({ queryKey: ['monitoring', 'session', sessionId, 'statistics'], exact: true })
    queryClient.invalidateQueries({ queryKey: ['monitoring', 'session', sessionId, 'details'], exact: true })
  }, [sessionId, queryClient])

  // Listen to candidate:logout WebSocket events for real-time updates
  const handleCandidateLogout = useCallback((data: CandidateLogoutEvent) => {
    console.log('[useMonitoringData] 🔴 candidate:logout event received:', {
      candidateId: data.candidateId,
      candidateName: data.candidateName,
      sessionId: data.sessionId,
      currentSessionId: sessionId,
      statistics: data.statistics,
      reason: data.reason,
      timestamp: data.timestamp,
    })

    // Only update if the event is for the current session
    if (data.sessionId !== sessionId) {
      console.log('[useMonitoringData] ⚠️ Event ignored - different session', {
        eventSession: data.sessionId,
        currentSession: sessionId
      })
      return
    }

    console.log('[useMonitoringData] ✅ Processing candidate logout event for current session')

    // 1. Update statistics in cache
    queryClient.setQueryData<SessionMonitoringStats>(
      ['monitoring', 'session', sessionId, 'statistics'],
      (oldData) => {
        if (!oldData) {
          console.log('[useMonitoringData] ⚠️ No statistics cache - triggering refetch')
          queryClient.invalidateQueries({ queryKey: ['monitoring', 'session', sessionId, 'statistics'] })
          return oldData
        }

        console.log('[useMonitoringData] 📊 Updating statistics cache:', {
          old: oldData.statistics,
          new: data.statistics
        })

        return {
          ...oldData,
          statistics: {
            ...data.statistics,
          },
          timestamp: data.timestamp,
        }
      }
    )

    // 2. Update candidate status in cache
    queryClient.setQueryData<SessionMonitoringDetails>(
      ['monitoring', 'session', sessionId, 'details'],
      (oldData) => {
        if (!oldData) {
          console.log('[useMonitoringData] ⚠️ No details cache - triggering refetch')
          queryClient.invalidateQueries({ queryKey: ['monitoring', 'session', sessionId, 'details'] })
          return oldData
        }

        console.log('[useMonitoringData] 👥 Updating candidate status in cache:', {
          totalCandidates: oldData.candidates.length,
          candidateId: data.candidateId,
          candidateName: data.candidateName
        })

        // Find and update the candidate's status to PENDING
        const updatedCandidates = oldData.candidates.map((c) => {
          if (c.id === data.candidateId) {
            console.log('[useMonitoringData] 🔄 Updating candidate status to PENDING:', data.candidateId)
            return {
              ...c,
              status: 'PENDING' as CandidateStatus,
            }
          }
          return c
        })

        console.log('[useMonitoringData] ✅ Candidate status updated successfully')

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

    // Schedule a lightweight refetch to reconcile with server truth
    queryClient.invalidateQueries({ queryKey: ['monitoring', 'session', sessionId, 'statistics'], exact: true })
    queryClient.invalidateQueries({ queryKey: ['monitoring', 'session', sessionId, 'details'], exact: true })
  }, [sessionId, queryClient])

  // Listen to exam:started WebSocket events for real-time updates
  const handleExamStarted = useCallback((data: ExamStartedEvent) => {
    console.log('[useMonitoringData] 📚 exam:started event received:', {
      candidateId: data.candidateId,
      sessionId: data.sessionId,
      totalQuestions: data.totalQuestions,
      totalAttempted: data.totalAttempted,
      currentSessionId: sessionId,
    })

    // Only update if the event is for the current session
    if (data.sessionId !== sessionId) {
      console.log('[useMonitoringData] ⚠️ Event ignored - different session', {
        eventSession: data.sessionId,
        currentSession: sessionId
      })
      return
    }

    console.log('[useMonitoringData] ✅ Processing exam started event for current session')

    // Update candidate's totalQuestions in cache
    queryClient.setQueryData<SessionMonitoringDetails>(
      ['monitoring', 'session', sessionId, 'details'],
      (oldData) => {
        if (!oldData) {
          console.log('[useMonitoringData] ⚠️ No details cache - triggering refetch')
          queryClient.invalidateQueries({ queryKey: ['monitoring', 'session', sessionId, 'details'] })
          return oldData
        }

        console.log('[useMonitoringData] 📝 Updating candidate exam progress in cache:', {
          candidateId: data.candidateId,
          totalQuestions: data.totalQuestions,
          totalAttempted: data.totalAttempted
        })

        // Find and update the candidate's totalQuestions and attempted
        const updatedCandidates = oldData.candidates.map((c) => {
          if (c.id === data.candidateId) {
            console.log('[useMonitoringData] 🔄 Setting exam progress for candidate:', {
              candidateId: data.candidateId,
              totalQuestions: data.totalQuestions,
              totalAttempted: data.totalAttempted
            })
            return {
              ...c,
              totalQuestions: data.totalQuestions,
              attempted: data.totalAttempted, // Use actual attempted count from event
            }
          }
          return c
        })

        console.log('[useMonitoringData] ✅ Candidate exam progress updated successfully')

        return {
          ...oldData,
          candidates: updatedCandidates,
        }
      }
    )
  }, [sessionId, queryClient])

  // Listen to exam:answerSubmitted WebSocket events for real-time progress updates
  const handleAnswerSubmitted = useCallback((data: ExamAnswerSubmittedEvent) => {
    console.log('[useMonitoringData] 📝 exam:answerSubmitted event received:', {
      candidateId: data.candidateId,
      sessionId: data.sessionId,
      totalAttemptedQuestions: data.totalAttemptedQuestions,
      totalQuestions: data.totalQuestions,
      currentSessionId: sessionId,
    })

    // Only update if the event is for the current session
    if (data.sessionId !== sessionId) {
      console.log('[useMonitoringData] ⚠️ Event ignored - different session', {
        eventSession: data.sessionId,
        currentSession: sessionId
      })
      return
    }

    console.log('[useMonitoringData] ✅ Processing answer submitted event for current session')

    // Update candidate's progress in cache
    queryClient.setQueryData<SessionMonitoringDetails>(
      ['monitoring', 'session', sessionId, 'details'],
      (oldData) => {
        if (!oldData) {
          console.log('[useMonitoringData] ⚠️ No details cache - triggering refetch')
          queryClient.invalidateQueries({ queryKey: ['monitoring', 'session', sessionId, 'details'] })
          return oldData
        }

        console.log('[useMonitoringData] 📊 Updating candidate progress in cache:', {
          candidateId: data.candidateId,
          totalAttemptedQuestions: data.totalAttemptedQuestions,
          totalQuestions: data.totalQuestions
        })

        // Find and update the candidate's progress
        const updatedCandidates = oldData.candidates.map((c) => {
          if (c.id === data.candidateId) {
            console.log('[useMonitoringData] 🔄 Updating progress for candidate:', {
              candidateId: data.candidateId,
              attempted: data.totalAttemptedQuestions,
              totalQuestions: data.totalQuestions
            })
            return {
              ...c,
              totalQuestions: data.totalQuestions,
              attempted: data.totalAttemptedQuestions,
            }
          }
          return c
        })

        console.log('[useMonitoringData] ✅ Candidate progress updated successfully')

        return {
          ...oldData,
          candidates: updatedCandidates,
        }
      }
    )
  }, [sessionId, queryClient])

  // Register WebSocket event listeners
  useSocketEvent('candidate:login', handleCandidateLogin)
  useSocketEvent('candidate:logout', handleCandidateLogout)
  useSocketEvent('exam:started', handleExamStarted)
  useSocketEvent('exam:answerSubmitted', handleAnswerSubmitted)

  // Debug: Log when event listeners are registered
  useEffect(() => {
    console.log('[useMonitoringData] 📡 Registered listeners for candidate events', {
      sessionId,
      loginHandlerRegistered: !!handleCandidateLogin,
      logoutHandlerRegistered: !!handleCandidateLogout,
      examStartedHandlerRegistered: !!handleExamStarted,
      answerSubmittedHandlerRegistered: !!handleAnswerSubmitted
    })
  }, [sessionId, handleCandidateLogin, handleCandidateLogout, handleExamStarted, handleAnswerSubmitted])

  const refetch = () => {
    refetchStats()
    if (sessionDetails) {
      refetchDetails()
    }
  }

  return {
    // Session data
    selectedSession: sessionStats ? {
      id: sessionStats.sessionId,
      name: sessionStats.sessionName,
      date: new Date(sessionStats.sessionDate),
      duration: sessionStats.sessionDuration,
      status: sessionStats.sessionStatus,
    } : null,

    // Statistics
    stats: sessionStats?.statistics || {
      scheduled: 0,
      absent: 0,
      active: 0,
      submitted: 0,
    },

    // Remaining time
    remainingTime: sessionStats?.remainingTime || '00:00:00',

    // Candidates (from details if loaded)
    candidates: sessionDetails?.candidates || [],

    // Loading states
    isLoading: isLoadingStats,
    isLoadingStats,
    isLoadingDetails,

    // Errors
    error: statsError || detailsError,
    statsError,
    detailsError,

    // Actions
    refetch,
    refetchStats,
    refetchDetails,

    // Session control
    controlSession: controlMutation.mutate,
    isControlling: controlMutation.isPending,
    controlError: controlMutation.error,
  }
}
