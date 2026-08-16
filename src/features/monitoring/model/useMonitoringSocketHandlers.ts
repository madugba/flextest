'use client'

import { useEffect, useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useSocketEvent } from '@/shared/hooks/useSocketEvent'
import { useSocket } from '@/shared/hooks/useSocket'
import { createCandidateLoginHandler } from './handlers/createCandidateLoginHandler'
import { createCandidateLogoutHandler } from './handlers/createCandidateLogoutHandler'
import { createExamStartedHandler } from './handlers/createExamStartedHandler'
import { createAnswerSubmittedHandler } from './handlers/createAnswerSubmittedHandler'
import { createCandidateUpdateHandler } from './handlers/createCandidateUpdateHandler'
import type { CandidateProgressRef } from './state/CandidateProgressRef'

interface UseMonitoringSocketHandlersArgs {
  sessionId?: string
  queryClient: ReturnType<typeof useQueryClient>
  progressRef: CandidateProgressRef
}

export function useMonitoringSocketHandlers({
  sessionId,
  queryClient,
  progressRef,
}: UseMonitoringSocketHandlersArgs) {
  const { socket, isConnected } = useSocket()

  const {
    handleCandidateLogin,
    handleCandidateLogout,
    handleExamStarted,
    handleAnswerSubmitted,
    handleCandidateUpdate,
  } = useMemo(
    () => ({
      handleCandidateLogin: createCandidateLoginHandler({ sessionId, queryClient }), // login candidate handler
      handleCandidateLogout: createCandidateLogoutHandler({ sessionId, queryClient }), // logout candidate handler
      handleExamStarted: createExamStartedHandler({ sessionId, queryClient, progressRef }), // start exam handler
      handleAnswerSubmitted: createAnswerSubmittedHandler({ sessionId, queryClient, progressRef }), // submit answer handler
      handleCandidateUpdate: createCandidateUpdateHandler({ sessionId, queryClient }), // update candidate status handler
    }),
    [sessionId, queryClient, progressRef]
  )

  useEffect(() => {
    if (!sessionId || !isConnected) return
    socket?.emit('subscribe:session', sessionId)
    return () => {
      socket?.emit('unsubscribe:session', sessionId)
    }
  }, [sessionId, socket, isConnected])

  useSocketEvent('candidate:login', handleCandidateLogin) // candidate login event handler
  useSocketEvent('candidate:logout', handleCandidateLogout) // candidate logout event handler
  useSocketEvent('exam:started', handleExamStarted) // exam started event handler
  useSocketEvent('exam:answerSubmitted', handleAnswerSubmitted) // answer submitted event handler
  useSocketEvent('candidate:update', handleCandidateUpdate) // candidate update event handler
}
