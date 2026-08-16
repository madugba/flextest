'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { getAllAIModels, type AIModelConfiguration } from '@/entities/ai-model'

export function useLoadAIModels(): AIModelConfiguration[] {
  const [aiModels, setAiModels] = useState<AIModelConfiguration[]>([])

  useEffect(() => {
    const loadAIModels = async () => {
      try {
        const models = await getAllAIModels()
        setAiModels(models.filter((m) => m.isActive))
      } catch (error) {
        console.error('Failed to load AI models:', error)
        toast.error('Failed to load AI models')
      }
    }
    loadAIModels()
  }, [])

  return aiModels
}
