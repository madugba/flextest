import { useQuery } from '@tanstack/react-query'
import { getAllAIModels } from '../api/aiModelApi'
import { queryKeys } from '@/shared/api/queryKeys'

export function useAIModelsQuery() {
  return useQuery({
    queryKey: queryKeys.aiModels,
    queryFn: () => getAllAIModels(),
  })
}
