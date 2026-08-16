import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createSubject,
  updateSubject,
  deleteSubject,
  importSubjectsFromApi,
  confirmImportSubjects,
} from '../api/subjectApi'
import type {
  CreateSubjectRequest,
  UpdateSubjectRequest,
  ImportSubjectsRequest,
  ConfirmImportRequest,
} from '../model/types'

const invalidateSubjects = (queryClient: ReturnType<typeof useQueryClient>) => {
  void queryClient.invalidateQueries({ queryKey: ['subjects'] })
}

export function useCreateSubjectMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateSubjectRequest) => createSubject(data),
    onSuccess: () => invalidateSubjects(queryClient),
  })
}

export function useUpdateSubjectMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSubjectRequest }) =>
      updateSubject(id, data),
    onSuccess: () => invalidateSubjects(queryClient),
  })
}

export function useDeleteSubjectMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteSubject(id),
    onSuccess: () => invalidateSubjects(queryClient),
  })
}

export function useImportSubjectsMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: ImportSubjectsRequest) => importSubjectsFromApi(data),
    onSuccess: () => invalidateSubjects(queryClient),
  })
}

export function useConfirmImportSubjectsMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: ConfirmImportRequest) => confirmImportSubjects(data),
    onSuccess: () => invalidateSubjects(queryClient),
  })
}
