import type { Dispatch, SetStateAction } from 'react'
import { toast } from 'sonner'
import { useUpdateExamSessionMutation, type ExamSession } from '@/entities/exam-session'
import type { ExamSessionFormData } from '../types'

interface EditHandlerDeps {
  selectedSession: ExamSession | null
  formData: ExamSessionFormData
  updateMutation: ReturnType<typeof useUpdateExamSessionMutation>
  setShowEditDialog: Dispatch<SetStateAction<boolean>>
  setSelectedSession: Dispatch<SetStateAction<ExamSession | null>>
  resetForm: () => void
}

export function createEditHandler(deps: EditHandlerDeps) {
  const {
    selectedSession,
    formData,
    updateMutation,
    setShowEditDialog,
    setSelectedSession,
    resetForm,
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
      await updateMutation.mutateAsync({
        id: selectedSession.id,
        data: {
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
        },
      })
      toast.success('Exam session updated successfully')
      setShowEditDialog(false)
      setSelectedSession(null)
      resetForm()
    } catch (error) {
      toast.error('Failed to update exam session', {
        description: error instanceof Error ? error.message : 'An error occurred',
      })
    }
  }
}
