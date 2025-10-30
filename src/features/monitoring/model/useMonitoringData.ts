import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect } from 'react'
import {
  getSessionStatistics,
  getSessionDetails,
  controlSession,
  type SessionControlRequest,
  type SessionMonitoringStats,
  type SessionMonitoringDetails
} from '@/entities/monitoring'
import type { CandidateStatus } from '@/entities/candidate'
import { useSocketEvent } from '@/shared/hooks/useSocketEvent'
import type { CandidateLoginEvent } from '@/shared/lib/socket'
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

  // Register WebSocket event listener
  useSocketEvent('candidate:login', handleCandidateLogin)

  // Debug: Log when event listener is registered
  useEffect(() => {
    console.log('[useMonitoringData] 📡 Registered listener for candidate:login event', {
      sessionId,
      handlerRegistered: !!handleCandidateLogin
    })
  }, [sessionId, handleCandidateLogin])

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
