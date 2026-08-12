import type { AIModelConfiguration } from '@/entities/ai-model'

export interface GenerateQuestionsRequest {
  model: AIModelConfiguration
  subjectName: string
  difficultyLevel: 'easy' | 'medium' | 'hard'
  additionalInstructions?: string
  numQuestions: number
}

export interface GeneratedQuestion {
  question: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  answer: 'A' | 'B' | 'C' | 'D'
}
