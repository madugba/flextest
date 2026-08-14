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
      handleCandidateLogin: createCandidateLoginHandler({ sessionId, queryClient }),
      handleCandidateLogout: createCandidateLogoutHandler({ sessionId, queryClient }),
      handleExamStarted: createExamStartedHandler({ sessionId, queryClient, progressRef }),
      handleAnswerSubmitted: createAnswerSubmittedHandler({ sessionId, queryClient, progressRef }),
      handleCandidateUpdate: createCandidateUpdateHandler({ sessionId, queryClient }),
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

  useSocketEvent('candidate:login', handleCandidateLogin)
  useSocketEvent('candidate:logout', handleCandidateLogout)
  useSocketEvent('exam:started', handleExamStarted)
  useSocketEvent('exam:answerSubmitted', handleAnswerSubmitted)
  useSocketEvent('candidate:update', handleCandidateUpdate)
}
