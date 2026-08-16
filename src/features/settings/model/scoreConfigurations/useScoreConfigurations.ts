'use client'

import type { Center } from '@/entities/center'
import type { ScoreConfigurationsController } from './types'
import { useScoreConfigurationLoad } from './effects/useScoreConfigurationLoad'
import { useScoreConfigurationState } from './effects/useScoreConfigurationState'
import { useScoreConfigurationsController } from './useScoreConfigurationsController'

export function useScoreConfigurations(centers: Center[]): ScoreConfigurationsController {
  const state = useScoreConfigurationState()
  const reload = useScoreConfigurationLoad(state)

  return {
    ...state,
    reload,
    ...useScoreConfigurationsController({ state, reload, centers }),
  }
}
