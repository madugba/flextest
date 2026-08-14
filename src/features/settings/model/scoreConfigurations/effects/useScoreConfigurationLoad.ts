import { useCallback, useEffect } from 'react'
import { createLoadScoreConfigurations } from '../handlers/createLoadScoreConfigurations'
import type { ScoreConfigurationState } from './useScoreConfigurationState'

export function useScoreConfigurationLoad({
  setScoreConfigurations,
  setIsLoadingScores,
  setScoreError,
}: Pick<
  ScoreConfigurationState,
  'setScoreConfigurations' | 'setIsLoadingScores' | 'setScoreError'
>): () => void {
  const reload = useCallback(
    () =>
      createLoadScoreConfigurations(setScoreConfigurations, setIsLoadingScores, setScoreError)(),
    [setScoreConfigurations, setIsLoadingScores, setScoreError]
  )

  useEffect(() => {
    void reload()
  }, [reload])

  return reload
}
