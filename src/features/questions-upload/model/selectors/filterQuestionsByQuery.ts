import type { Question } from '@/entities/question'

export function filterQuestionsByQuery(questions: Question[], query: string): Question[] {
  return questions.filter((question) =>
    question.question.toLowerCase().includes(query.toLowerCase())
  )
}
