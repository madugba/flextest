import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createQuestion,
  updateQuestion,
  deleteQuestion,
  bulkImportQuestions,
} from '../api/questionApi'
import type {
  CreateQuestionRequest,
  UpdateQuestionRequest,
  BulkImportQuestionsRequest,
} from '../model/types'

function invalidateQuestionCaches(queryClient: ReturnType<typeof useQueryClient>) {
  void queryClient.invalidateQueries({ queryKey: ['questions'] })
  void queryClient.invalidateQueries({ queryKey: ['subjects', 'with-questions'] })
}

export function useCreateQuestionMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateQuestionRequest) => createQuestion(data),
    onSuccess: () => invalidateQuestionCaches(queryClient),
  })
}

export function useUpdateQuestionMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateQuestionRequest }) =>
      updateQuestion(id, data),
    onSuccess: () => invalidateQuestionCaches(queryClient),
  })
}

export function useDeleteQuestionMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteQuestion(id),
    onSuccess: () => invalidateQuestionCaches(queryClient),
  })
}

export function useBulkImportQuestionsMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: BulkImportQuestionsRequest) => bulkImportQuestions(data),
    onSuccess: () => invalidateQuestionCaches(queryClient),
  })
}
