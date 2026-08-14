import type { Dispatch, SetStateAction } from 'react'
import { toast } from 'sonner'
import { getAllAIModels, type AIModelConfiguration } from '@/entities/ai-model'

export function createLoadAIModels(setAiModels: Dispatch<SetStateAction<AIModelConfiguration[]>>) {
  return async () => {
    try {
      const data = await getAllAIModels()
      setAiModels(data)
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes('NOT_FOUND')) {
        return
      }
      toast.error('Failed to load AI models')
    }
  }
}
