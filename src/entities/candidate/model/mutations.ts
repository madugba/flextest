import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createCandidate, updateCandidate, deleteCandidate, importCandidates } from '../api/candidateApi'
import type { CreateCandidateRequest, UpdateCandidateRequest, ImportCandidatesRequest } from '../model/types'

function invalidateCandidateCaches(queryClient: ReturnType<typeof useQueryClient>) {
  void queryClient.invalidateQueries({ queryKey: ['candidates'] })
  void queryClient.invalidateQueries({ queryKey: ['subjects', 'session'] })
  void queryClient.invalidateQueries({ queryKey: ['subjects', 'with-questions'] })
}

export function useCreateCandidateMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateCandidateRequest) => createCandidate(data),
    onSuccess: () => invalidateCandidateCaches(queryClient),
  })
}

export function useUpdateCandidateMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCandidateRequest }) =>
      updateCandidate(id, data),
    onSuccess: () => invalidateCandidateCaches(queryClient),
  })
}

export function useDeleteCandidateMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteCandidate(id),
    onSuccess: () => invalidateCandidateCaches(queryClient),
  })
}

export function useImportCandidatesMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: ImportCandidatesRequest) => importCandidates(data),
    onSuccess: () => invalidateCandidateCaches(queryClient),
  })
}
