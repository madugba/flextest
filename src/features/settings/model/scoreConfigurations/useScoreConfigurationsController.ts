'use client'

import type { Center } from '@/entities/center'
import {
  useActivateScoreConfigurationMutation,
  useCreateScoreConfigurationMutation,
  useDeleteScoreConfigurationMutation,
  usePreviewScoreMutation,
  useUpdateScoreConfigurationMutation,
  useValidateFormulaMutation,
} from '@/entities/score-configuration'
import { useScoreConfigurationsFormActions } from './useScoreConfigurationsFormActions'
import { useScoreConfigurationsItemActions } from './useScoreConfigurationsItemActions'
import type { ScoreConfigurationState } from './useScoreConfigurationState'

interface UseScoreConfigurationsControllerDeps {
  state: ScoreConfigurationState
  centers: Center[]
  createMutation: ReturnType<typeof useCreateScoreConfigurationMutation>
  updateMutation: ReturnType<typeof useUpdateScoreConfigurationMutation>
  activateMutation: ReturnType<typeof useActivateScoreConfigurationMutation>
  deleteMutation: ReturnType<typeof useDeleteScoreConfigurationMutation>
  validateMutation: ReturnType<typeof useValidateFormulaMutation>
  previewMutation: ReturnType<typeof usePreviewScoreMutation>
}

export function useScoreConfigurationsController({
  state,
  centers,
  createMutation,
  updateMutation,
  activateMutation,
  deleteMutation,
  validateMutation,
  previewMutation,
}: UseScoreConfigurationsControllerDeps) {
  const formActions = useScoreConfigurationsFormActions(state, centers, createMutation, updateMutation)
  const itemActions = useScoreConfigurationsItemActions(
    state,
    activateMutation,
    deleteMutation,
    validateMutation,
    previewMutation
  )

  return { ...formActions, ...itemActions }
}
