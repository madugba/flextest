import type { Dispatch, SetStateAction } from 'react'
import { toast } from 'sonner'
import { updateExamSession, type ExamSession } from '@/entities/exam-session'
import type { ExamSessionFormData } from '../types'

interface EditHandlerDeps {
  selectedSession: ExamSession | null
  formData: ExamSessionFormData
  setIsSubmitting: Dispatch<SetStateAction<boolean>>
  setShowEditDialog: Dispatch<SetStateAction<boolean>>
  setSelectedSession: Dispatch<SetStateAction<ExamSession | null>>
  resetForm: () => void
  fetchExamSessions: () => Promise<void>
}

export function createEditHandler(deps: EditHandlerDeps) {
  const {
    selectedSession,
    formData,
    setIsSubmitting,
    setShowEditDialog,
    setSelectedSession,
    resetForm,
    fetchExamSessions,
  } = deps

  return async () => {
    if (!selectedSession || !formData.name.trim()) return

    if (!formData.compulsorySubjectId) {
      toast.error('Please select a compulsory subject')
      return
    }

    if (!formData.duration || parseInt(formData.duration) <= 0) {
      toast.error('Please enter a valid duration')
      return
    }

    try {
      setIsSubmitting(true)
      await updateExamSession(selectedSession.id, {
        name: formData.name.trim(),
        date: formData.date ? new Date(formData.date).toISOString() : undefined,
        time: formData.time || undefined,
        duration: formData.duration ? parseInt(formData.duration) : undefined,
        hallCapacity: formData.hallCapacity ? parseInt(formData.hallCapacity) : undefined,
        totalQuestion: formData.totalQuestion ? parseInt(formData.totalQuestion) : undefined,
        totalCompulsorySubject: formData.compulsorySubjectId ? 1 : 0,
        totalCompulsoryQuestion: formData.totalCompulsoryQuestion
          ? parseInt(formData.totalCompulsoryQuestion)
          : undefined,
        totalOtherQuestions: formData.totalOtherQuestions
          ? parseInt(formData.totalOtherQuestions)
          : undefined,
        compulsorySubjectId: formData.compulsorySubjectId || undefined,
        centerId: formData.centerId || undefined,
      })
      toast.success('Exam session updated successfully')
      setShowEditDialog(false)
      setSelectedSession(null)
      resetForm()
      await fetchExamSessions()
    } catch (error) {
      toast.error('Failed to update exam session', {
        description: error instanceof Error ? error.message : 'An error occurred',
      })
    } finally {
      setIsSubmitting(false)
    }
  }
}
