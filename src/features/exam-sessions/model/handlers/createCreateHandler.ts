import type { Dispatch, SetStateAction } from 'react'
import { toast } from 'sonner'
import { useCreateExamSessionMutation } from '@/entities/exam-session'
import type { ExamSessionFormData } from '../types'

interface CreateHandlerDeps {
  formData: ExamSessionFormData
  createMutation: ReturnType<typeof useCreateExamSessionMutation>
  setShowCreateDialog: Dispatch<SetStateAction<boolean>>
  resetForm: () => void
}

export function createCreateHandler(deps: CreateHandlerDeps) {
  const { formData, createMutation, setShowCreateDialog, resetForm } = deps

  return async () => {
    if (!formData.name.trim() || !formData.date || !formData.time || !formData.centerId) {
      toast.error('Please fill in all required fields (Name, Date, Time, and Center)')
      return
    }

    if (!formData.compulsorySubjectId) {
      toast.error('Please select a compulsory subject')
      return
    }

    if (!formData.duration || parseInt(formData.duration) <= 0) {
      toast.error('Please enter a valid duration')
      return
    }

    try {
      await createMutation.mutateAsync({
        name: formData.name.trim(),
        date: new Date(formData.date).toISOString(),
        time: formData.time,
        duration: parseInt(formData.duration),
        hallCapacity: parseInt(formData.hallCapacity) || 0,
        totalQuestion: parseInt(formData.totalQuestion) || 0,
        totalCompulsorySubject: formData.compulsorySubjectId ? 1 : 0,
        totalCompulsoryQuestion: parseInt(formData.totalCompulsoryQuestion) || 0,
        totalOtherQuestions: parseInt(formData.totalOtherQuestions) || 0,
        compulsorySubjectId: formData.compulsorySubjectId,
        centerId: formData.centerId,
      })
      toast.success('Exam session created successfully')
      setShowCreateDialog(false)
      resetForm()
    } catch (error) {
      toast.error('Failed to create exam session', {
        description: error instanceof Error ? error.message : 'An error occurred',
      })
    }
  }
}
