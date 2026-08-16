import { useQuery } from '@tanstack/react-query'
import { getAllScoreConfigurations, getScoreConfigurationsByCenterId, getActiveScoreConfiguration } from '../api/scoreConfigurationApi'
import { queryKeys } from '@/shared/api/queryKeys'

export function useScoreConfigurationsQuery(centerId?: string) {
  return useQuery({
    queryKey: centerId ? queryKeys.scoreConfigurationsByCenter(centerId) : queryKeys.scoreConfigurations,
    queryFn: () => (centerId ? getScoreConfigurationsByCenterId(centerId) : getAllScoreConfigurations()),
  })
}

export function useActiveScoreConfigurationQuery(centerId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.activeScoreConfiguration(centerId ?? ''),
    queryFn: () => getActiveScoreConfiguration(centerId as string),
    enabled: !!centerId,
  })
}
