import { useCallback, useEffect, useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import type { Center } from '@/entities/center'
import { useApiConfigurations } from './apiConfigurations/useApiConfigurations'
import { useAIModels } from './aiModels/useAIModels'
import { useScoreConfigurations } from './scoreConfigurations/useScoreConfigurations'
import { createLoadCenters } from './shared/handlers/createLoadCenters'

interface UseSettingsPageReturn {
  loading: boolean
  centers: Center[]
  setLoading: Dispatch<SetStateAction<boolean>>
  reloadCenters: () => void
  apiConfigurations: ReturnType<typeof useApiConfigurations>
  aiModels: ReturnType<typeof useAIModels>
  scoreConfigurations: ReturnType<typeof useScoreConfigurations>
}

export function useSettingsPage(): UseSettingsPageReturn {
  const [loading, setLoading] = useState(true)
  const [centers, setCenters] = useState<Center[]>([])

  const reloadCenters = useCallback(() => createLoadCenters(setCenters)(), [setCenters])

  useEffect(() => {
    void reloadCenters()
  }, [reloadCenters])

  const apiConfigurations = useApiConfigurations({ centers, setLoading })
  const aiModels = useAIModels(centers)
  const scoreConfigurations = useScoreConfigurations(centers)

  return {
    loading,
    centers,
    setLoading,
    reloadCenters,
    apiConfigurations,
    aiModels,
    scoreConfigurations,
  }
}
