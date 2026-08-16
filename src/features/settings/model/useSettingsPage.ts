'use client'

import { useCallback, useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import { useCentersQuery, type Center } from '@/entities/center'
import { useApiConfigurations } from './apiConfigurations/useApiConfigurations'
import { useAIModels } from './aiModels/useAIModels'
import { useScoreConfigurations } from './scoreConfigurations/useScoreConfigurations'

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

  const centersQuery = useCentersQuery()
  const centers = centersQuery.data ?? []

  const reloadCenters = useCallback(() => {
    void centersQuery.refetch()
  }, [centersQuery])

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
