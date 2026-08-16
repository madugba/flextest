import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createScoreConfiguration,
  updateScoreConfiguration,
  activateScoreConfiguration,
  deleteScoreConfiguration,
  validateFormula,
  previewScore,
} from '../api/scoreConfigurationApi'
import type {
  CreateScoreConfigurationRequest,
  UpdateScoreConfigurationRequest,
  ValidateFormulaRequest,
  PreviewScoreRequest,
} from '../model/types'

function invalidateScoreConfigurationCaches(queryClient: ReturnType<typeof useQueryClient>) {
  void queryClient.invalidateQueries({ queryKey: ['score-configurations'] })
}

export function useCreateScoreConfigurationMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateScoreConfigurationRequest) => createScoreConfiguration(data),
    onSuccess: () => invalidateScoreConfigurationCaches(queryClient),
  })
}

export function useUpdateScoreConfigurationMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateScoreConfigurationRequest }) =>
      updateScoreConfiguration(id, data),
    onSuccess: () => invalidateScoreConfigurationCaches(queryClient),
  })
}

export function useActivateScoreConfigurationMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => activateScoreConfiguration(id),
    onSuccess: () => invalidateScoreConfigurationCaches(queryClient),
  })
}

export function useDeleteScoreConfigurationMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteScoreConfiguration(id),
    onSuccess: () => invalidateScoreConfigurationCaches(queryClient),
  })
}

export function useValidateFormulaMutation() {
  return useMutation({
    mutationFn: (data: ValidateFormulaRequest) => validateFormula(data),
  })
}

export function usePreviewScoreMutation() {
  return useMutation({
    mutationFn: (data: PreviewScoreRequest) => previewScore(data),
  })
}
