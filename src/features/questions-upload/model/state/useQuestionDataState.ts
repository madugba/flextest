import { useState } from 'react'
import type { Question } from '@/entities/question'
import type { ExamSession } from '@/entities/exam-session'
import type { Subject } from '@/entities/subject'

export function useQuestionDataState() {
  const [subject, setSubject] = useState<Subject | null>(null)
  const [session, setSession] = useState<ExamSession | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return {
    subject,
    setSubject,
    session,
    setSession,
    questions,
    setQuestions,
    isLoading,
    setIsLoading,
    isSaving,
    setIsSaving,
    error,
    setError,
  }
}
