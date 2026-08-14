import type { Center } from '@/entities/center'
import { useScoreConfigurationsFormActions } from './effects/useScoreConfigurationsFormActions'
import { useScoreConfigurationsItemActions } from './effects/useScoreConfigurationsItemActions'
import type { ScoreConfigurationState } from './effects/useScoreConfigurationState'

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
