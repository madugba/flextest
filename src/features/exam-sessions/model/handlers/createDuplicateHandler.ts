import type { Dispatch, SetStateAction } from 'react'
import { toast } from 'sonner'
import { createExamSession, type ExamSession } from '@/entities/exam-session'
import type { Subject } from '@/entities/subject'
import { collectDuplicateQuestions } from '../../lib/collect-duplicate-questions'

interface DuplicateHandlerDeps {
  selectedSession: ExamSession | null
  duplicateName: string
  duplicateSelectedSubjects: string[]
  setIsSubmitting: Dispatch<SetStateAction<boolean>>
  setShowDuplicateDialog: Dispatch<SetStateAction<boolean>>
  setSelectedSession: Dispatch<SetStateAction<ExamSession | null>>
  setDuplicateName: Dispatch<SetStateAction<string>>
  setDuplicateSelectedSubjects: Dispatch<SetStateAction<string[]>>
  setDuplicateSourceSubjects: Dispatch<SetStateAction<Array<Subject & { questionCount: number }>>>
  fetchExamSessions: () => Promise<void>
}

export function createDuplicateHandler(deps: DuplicateHandlerDeps) {
  const {
    selectedSession,
    duplicateName,
    duplicateSelectedSubjects,
    setIsSubmitting,
    setShowDuplicateDialog,
    setSelectedSession,
    setDuplicateName,
    setDuplicateSelectedSubjects,
    setDuplicateSourceSubjects,
    fetchExamSessions,
  } = deps

  return async () => {
    if (!selectedSession || !duplicateName.trim()) return
    if (duplicateSelectedSubjects.length === 0) {
      toast.error('Please select at least one subject to include')
      return
    }

    try {
      setIsSubmitting(true)

      // Create the new session with the same settings and new name
      const newSession = await createExamSession({
        name: duplicateName.trim(),
        date: selectedSession.date,
        time: selectedSession.time,
        duration: selectedSession.duration,
        hallCapacity: selectedSession.hallCapacity,
        totalQuestion: selectedSession.totalQuestion,
        totalCompulsorySubject: selectedSession.totalCompulsorySubject,
        totalCompulsoryQuestion: selectedSession.totalCompulsoryQuestion,
        totalOtherQuestions: selectedSession.totalOtherQuestions,
        compulsorySubjectId: selectedSession.compulsorySubjectId ?? '',
        centerId: selectedSession.centerId ?? undefined,
      })

      // Fetch questions for each selected subject, bulk import them into the new session
      const allQuestions = await collectDuplicateQuestions(
        selectedSession.id,
        duplicateSelectedSubjects,
        newSession.id
      )

      toast.success('Exam session duplicated successfully', {
        description: `"${newSession.name}" created with ${allQuestions.length} question${
          allQuestions.length !== 1 ? 's' : ''
        }`,
      })
      setShowDuplicateDialog(false)
      setSelectedSession(null)
      setDuplicateName('')
      setDuplicateSelectedSubjects([])
      setDuplicateSourceSubjects([])
      await fetchExamSessions()
    } catch (error) {
      toast.error('Failed to duplicate exam session', {
        description: error instanceof Error ? error.message : 'An error occurred',
      })
    } finally {
      setIsSubmitting(false)
    }
  }
}
