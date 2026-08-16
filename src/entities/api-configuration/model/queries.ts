import { useQuery } from '@tanstack/react-query'
import { getAllAPIConfigurations, getAPIConfigurationsByCenterId } from '../api/apiConfigurationApi'
import { queryKeys } from '@/shared/api/queryKeys'

export function useAPIConfigurationsQuery(centerId?: string) {
  return useQuery({
    queryKey: centerId ? queryKeys.apiConfigurationsByCenter(centerId) : queryKeys.apiConfigurations,
    queryFn: () => (centerId ? getAPIConfigurationsByCenterId(centerId) : getAllAPIConfigurations()),
  })
}
