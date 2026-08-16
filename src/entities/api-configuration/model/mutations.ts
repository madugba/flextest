import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAPIConfiguration, updateAPIConfiguration, deleteAPIConfiguration } from '../api/apiConfigurationApi'
import type { CreateAPIConfigurationRequest, UpdateAPIConfigurationRequest } from '../model/types'

function invalidateAPIConfigurationCaches(queryClient: ReturnType<typeof useQueryClient>) {
  void queryClient.invalidateQueries({ queryKey: ['api-configurations'] })
}

export function useCreateAPIConfigurationMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateAPIConfigurationRequest) => createAPIConfiguration(data),
    onSuccess: () => invalidateAPIConfigurationCaches(queryClient),
  })
}

export function useUpdateAPIConfigurationMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAPIConfigurationRequest }) =>
      updateAPIConfiguration(id, data),
    onSuccess: () => invalidateAPIConfigurationCaches(queryClient),
  })
}

export function useDeleteAPIConfigurationMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteAPIConfiguration(id),
    onSuccess: () => invalidateAPIConfigurationCaches(queryClient),
  })
}
