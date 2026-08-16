import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAIModel, updateAIModel, deleteAIModel } from '../api/aiModelApi'
import type { CreateAIModelRequest, UpdateAIModelRequest } from '../model/types'

function invalidateAIModelCaches(queryClient: ReturnType<typeof useQueryClient>) {
  void queryClient.invalidateQueries({ queryKey: ['ai-models'] })
}

export function useCreateAIModelMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateAIModelRequest) => createAIModel(data),
    onSuccess: () => invalidateAIModelCaches(queryClient),
  })
}

export function useUpdateAIModelMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAIModelRequest }) =>
      updateAIModel(id, data),
    onSuccess: () => invalidateAIModelCaches(queryClient),
  })
}

export function useDeleteAIModelMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteAIModel(id),
    onSuccess: () => invalidateAIModelCaches(queryClient),
  })
}
