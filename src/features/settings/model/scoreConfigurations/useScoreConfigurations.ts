'use client'

import { useCallback } from 'react'
import type { Center } from '@/entities/center'
import {
  useScoreConfigurationsQuery,
  useCreateScoreConfigurationMutation,
  useUpdateScoreConfigurationMutation,
  useActivateScoreConfigurationMutation,
  useDeleteScoreConfigurationMutation,
  useValidateFormulaMutation,
  usePreviewScoreMutation,
} from '@/entities/score-configuration'
import type { ScoreConfigurationsController } from './types'
import { useScoreConfigurationState } from './useScoreConfigurationState'
import { useScoreConfigurationsController } from './useScoreConfigurationsController'

export function useScoreConfigurations(centers: Center[]): ScoreConfigurationsController {
  const state = useScoreConfigurationState()

  const query = useScoreConfigurationsQuery()
  const createMutation = useCreateScoreConfigurationMutation()
  const updateMutation = useUpdateScoreConfigurationMutation()
  const activateMutation = useActivateScoreConfigurationMutation()
  const deleteMutation = useDeleteScoreConfigurationMutation()
  const validateMutation = useValidateFormulaMutation()
  const previewMutation = usePreviewScoreMutation()

  const reload = useCallback(() => {
    void query.refetch()
  }, [query])

  const scoreConfigurations = query.data ?? []
  const isLoadingScores = query.isLoading

  const statusCode =
    typeof query.error === 'object' && query.error !== null && 'statusCode' in query.error
      ? (query.error as { statusCode?: number }).statusCode
      : undefined
  const scoreError = statusCode !== 404 ? (query.error?.message ?? null) : null

  return {
    ...state,
    scoreConfigurations,
    isLoadingScores,
    scoreError,
    isValidating: validateMutation.isPending,
    isPreviewing: previewMutation.isPending,
    isCreatingScore: createMutation.isPending,
    isUpdatingScore: updateMutation.isPending,
    isActivatingScore: activateMutation.isPending,
    isDeletingScore: deleteMutation.isPending,
    reload,
    ...useScoreConfigurationsController({
      state,
      centers,
      createMutation,
      updateMutation,
      activateMutation,
      deleteMutation,
      validateMutation,
      previewMutation,
    }),
  }
}
