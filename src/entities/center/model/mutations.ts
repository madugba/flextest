import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createCenter, updateCenter, deleteCenter } from '../api/centerApi'
import type { CreateCenterRequest, UpdateCenterRequest } from '../model/types'

function invalidateCenterCaches(queryClient: ReturnType<typeof useQueryClient>) {
  void queryClient.invalidateQueries({ queryKey: ['centers'] })
}

export function useCreateCenterMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateCenterRequest) => createCenter(data),
    onSuccess: () => invalidateCenterCaches(queryClient),
  })
}

export function useUpdateCenterMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCenterRequest }) =>
      updateCenter(id, data),
    onSuccess: () => invalidateCenterCaches(queryClient),
  })
}

export function useDeleteCenterMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteCenter(id),
    onSuccess: () => invalidateCenterCaches(queryClient),
  })
}
