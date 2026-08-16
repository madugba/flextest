import { useQuery } from '@tanstack/react-query'
import {
  getAllSubjects,
  getSubjectById,
  getSubjectsForSession,
  getSubjectsWithQuestionsBySession,
} from '../api/subjectApi'
import { queryKeys } from '@/shared/api/queryKeys'

export function useSubjectsQuery(search?: string) {
  return useQuery({
    queryKey: search ? ['subjects', 'search', search] : queryKeys.subjects,
    queryFn: () => getAllSubjects(search),
    enabled: true,
  })
}

export function useSubjectQuery(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.subject(id ?? ''),
    queryFn: () => getSubjectById(id as string),
    enabled: !!id,
  })
}

export function useSubjectsForSessionQuery(sessionId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.subjectsBySession(sessionId ?? ''),
    queryFn: () => getSubjectsForSession(sessionId as string),
    enabled: !!sessionId,
  })
}

export function useSubjectsWithQuestionsQuery(sessionId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.subjectsWithQuestions(sessionId ?? ''),
    queryFn: () => getSubjectsWithQuestionsBySession(sessionId as string),
    enabled: !!sessionId,
  })
}
