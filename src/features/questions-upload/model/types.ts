import type { AnswerOption } from '@/entities/question'

export type ValidParsedRow = {
  rowNumber: number
  valid: true
  question: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  answer: AnswerOption
}

export type InvalidParsedRow = {
  rowNumber: number
  valid: false
  errors: string[]
  question: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  answer: string
}

export type ParsedRow = ValidParsedRow | InvalidParsedRow

export interface QuestionFormData {
  question: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  answer: AnswerOption | ''
}

export interface AiGenerateFormData {
  modelId: string
  numQuestions: number
  difficultyLevel: 'easy' | 'medium' | 'hard'
  extraPrompt: string
}
