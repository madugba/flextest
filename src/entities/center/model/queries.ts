import { useQuery } from '@tanstack/react-query'
import { getAllCenters, getCenterById } from '../api/centerApi'
import { queryKeys } from '@/shared/api/queryKeys'

export function useCentersQuery() {
  return useQuery({
    queryKey: queryKeys.centers,
    queryFn: () => getAllCenters(),
  })
}

export function useCenterQuery(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.center(id ?? ''),
    queryFn: () => getCenterById(id as string),
    enabled: !!id,
  })
}
