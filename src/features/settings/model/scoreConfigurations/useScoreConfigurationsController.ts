'use client'

import type { Center } from '@/entities/center'
import { useScoreConfigurationsFormActions } from './useScoreConfigurationsFormActions'
import { useScoreConfigurationsItemActions } from './useScoreConfigurationsItemActions'
import type { ScoreConfigurationState } from './useScoreConfigurationState'

interface UseScoreConfigurationsControllerDeps {
  state: ScoreConfigurationState
  reload: () => void
  centers: Center[]
}

export function useScoreConfigurationsController({
  state,
  reload,
  centers,
}: UseScoreConfigurationsControllerDeps) {
  const formActions = useScoreConfigurationsFormActions(state, reload, centers)
  const itemActions = useScoreConfigurationsItemActions(state, reload)

  return { ...formActions, ...itemActions }
}
