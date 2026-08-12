import { useEffect } from 'react'
import type { Question } from '@/entities/question'

export function useQuestionsDebugLog(questions: Question[]): void {
  useEffect(() => {
    console.log('[questions state] Updated:', {
      count: questions.length,
      items: questions,
    })
  }, [questions])
}
