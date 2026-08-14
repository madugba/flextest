'use client'

import { useSearchParams } from 'next/navigation'
import { useMetricsSocket } from '@/shared/hooks/useMetricsSocket'
import { useMonitoringData } from './useMonitoringData'
import { useLogoutCandidate } from './useLogoutCandidate'
import { useBulkLogoutCandidates } from './useBulkLogoutCandidates'
import { useTimer } from './useTimer'
import { useMonitoringViewState } from './state/useMonitoringViewState'
import { useMonitoringViewDerived } from './state/useMonitoringViewDerived'
import { createDialogOpeners } from './handlers/createDialogOpeners'
import { createConfirmActions } from './handlers/createConfirmActions'
import { createSelectionActions } from './handlers/createSelectionActions'

export function useMonitoringView() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session')

  const viewState = useMonitoringViewState({ sessionId })

  const {
    selectedSession,
    stats,
    candidates,
    isLoading,
    error,
    controlSession,
    isControlling,
    controlError,
  } = useMonitoringData(sessionId || undefined, viewState.isAutoRefresh)

  const { elapsedHms } = useTimer({
    sessionId,
    sessionStatus: selectedSession?.status,
    enableLocalTick: true,
  })

  const { connectedClients, isSubscribed } = useMetricsSocket()

  const { mutate: logoutMutate, isPending: logoutPending } = useLogoutCandidate(
    sessionId || undefined
  )
  const { mutate: bulkLogoutMutate, isPending: bulkLogoutPending } = useBulkLogoutCandidates(
    sessionId || undefined
  )

  const derived = useMonitoringViewDerived({ candidates, selectedSession, stats, ...viewState })

  const dialogOpeners = createDialogOpeners({ selectedSession, ...viewState })

  const confirmActions = createConfirmActions({ controlSession, logoutMutate, bulkLogoutMutate, ...viewState })

  const selectionActions = createSelectionActions({
    ...viewState,
    filteredCandidates: derived.filteredCandidates,
  })

  return {
    sessionId,
    selectedSession,
    stats,
    candidates,
    isLoading,
    error,
    controlError,
    isControlling,
    elapsedHms,
    connectedClients,
    isSubscribed,
    ...viewState,
    ...derived,
    ...dialogOpeners,
    ...confirmActions,
    ...selectionActions,
    logoutPending,
    bulkLogoutPending,
  }
}
