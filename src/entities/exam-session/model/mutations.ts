import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createExamSession,
  updateExamSession,
  deleteExamSession,
  importExamSessionsFromApi,
  rescheduleExamSession,
} from '../api/examSessionApi'
import type { CreateExamSessionRequest, UpdateExamSessionRequest } from '../model/types'

function invalidateSessionCaches(queryClient: ReturnType<typeof useQueryClient>) {
  void queryClient.invalidateQueries({ queryKey: ['exam-sessions'] })
  void queryClient.invalidateQueries({ queryKey: ['monitoring', 'sessions'] })
}

export function useCreateExamSessionMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateExamSessionRequest) => createExamSession(data),
    onSuccess: () => invalidateSessionCaches(queryClient),
  })
}

export function useUpdateExamSessionMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateExamSessionRequest }) =>
      updateExamSession(id, data),
    onSuccess: () => invalidateSessionCaches(queryClient),
  })
}

export function useDeleteExamSessionMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteExamSession(id),
    onSuccess: () => invalidateSessionCaches(queryClient),
  })
}

export function useImportExamSessionsMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (apiEndpoint: string) => importExamSessionsFromApi(apiEndpoint),
    onSuccess: () => invalidateSessionCaches(queryClient),
  })
}

export function useRescheduleExamSessionMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => rescheduleExamSession(id),
    onSuccess: () => invalidateSessionCaches(queryClient),
  })
}
