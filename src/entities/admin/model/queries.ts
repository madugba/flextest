import { useQuery } from '@tanstack/react-query'
import { getAllAdmins } from '../api/adminApi'
import { queryKeys } from '@/shared/api/queryKeys'

export function useAdminsQuery() {
  return useQuery({
    queryKey: queryKeys.admins,
    queryFn: () => getAllAdmins(),
  })
}
