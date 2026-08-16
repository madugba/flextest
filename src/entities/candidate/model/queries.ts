import { useQuery } from '@tanstack/react-query'
import { getAllCandidates, getCandidateById } from '../api/candidateApi'
import type { CandidateFilters } from '../model/types'
import { queryKeys } from '@/shared/api/queryKeys'

export function useCandidatesQuery(filters?: CandidateFilters) {
  return useQuery({
    queryKey: [...queryKeys.candidates, filters ?? {}],
    queryFn: () => getAllCandidates(filters),
  })
}

export function useCandidateQuery(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.candidate(id ?? ''),
    queryFn: () => getCandidateById(id as string),
    enabled: !!id,
  })
}
