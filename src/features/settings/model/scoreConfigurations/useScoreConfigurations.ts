'use client'

import { useCallback, useEffect } from 'react'
import type { Center } from '@/entities/center'
import { createLoadScoreConfigurations } from './handlers/createLoadScoreConfigurations'
import type { ScoreConfigurationsController } from './types'
import { useScoreConfigurationState } from './useScoreConfigurationState'
import { useScoreConfigurationsController } from './useScoreConfigurationsController'

export function useScoreConfigurations(centers: Center[]): ScoreConfigurationsController {
  const state = useScoreConfigurationState()

  const { setScoreConfigurations, setIsLoadingScores, setScoreError } = state

  const reload = useCallback(
    () =>
      createLoadScoreConfigurations(setScoreConfigurations, setIsLoadingScores, setScoreError)(),
    [setScoreConfigurations, setIsLoadingScores, setScoreError]
  )

  useEffect(() => {
    void reload()
  }, [reload])

  return {
    ...state,
    reload,
    ...useScoreConfigurationsController({ state, reload, centers }),
  }
}
