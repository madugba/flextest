import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAdmin, updateAdmin, updateAdminPassword, deleteAdmin, blockAdmin, unblockAdmin } from '../api/adminApi'
import type { CreateAdminRequest, UpdateAdminRequest, UpdatePasswordRequest } from '../model/types'

function invalidateAdminCaches(queryClient: ReturnType<typeof useQueryClient>) {
  void queryClient.invalidateQueries({ queryKey: ['admins'] })
}

export function useCreateAdminMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateAdminRequest) => createAdmin(data),
    onSuccess: () => invalidateAdminCaches(queryClient),
  })
}

export function useUpdateAdminMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAdminRequest }) => updateAdmin(id, data),
    onSuccess: () => invalidateAdminCaches(queryClient),
  })
}

export function useUpdateAdminPasswordMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePasswordRequest }) =>
      updateAdminPassword(id, data),
    onSuccess: () => invalidateAdminCaches(queryClient),
  })
}

export function useDeleteAdminMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteAdmin(id),
    onSuccess: () => invalidateAdminCaches(queryClient),
  })
}

export function useBlockAdminMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => blockAdmin(id),
    onSuccess: () => invalidateAdminCaches(queryClient),
  })
}

export function useUnblockAdminMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => unblockAdmin(id),
    onSuccess: () => invalidateAdminCaches(queryClient),
  })
}
