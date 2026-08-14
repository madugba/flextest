import type { Dispatch, SetStateAction } from 'react'
import { toast } from 'sonner'
import { getAllScoreConfigurations, type ScoreConfiguration } from '@/entities/score-configuration'

export function createLoadScoreConfigurations(
  setScoreConfigurations: Dispatch<SetStateAction<ScoreConfiguration[]>>,
  setIsLoadingScores: Dispatch<SetStateAction<boolean>>,
  setScoreError: Dispatch<SetStateAction<string | null>>
) {
  return async () => {
    setIsLoadingScores(true)
    setScoreError(null)
    try {
      const data = await getAllScoreConfigurations()
      setScoreConfigurations(data)
    } catch (error: unknown) {
      const statusCode =
        typeof error === 'object' && error !== null && 'statusCode' in error
          ? (error as { statusCode?: number }).statusCode
          : undefined
      if (statusCode !== 404) {
        setScoreError('Failed to load score configurations')
        toast.error('Failed to load score configurations')
      }
    } finally {
      setIsLoadingScores(false)
    }
  }
}
