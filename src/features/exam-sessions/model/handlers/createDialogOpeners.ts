import type { Dispatch, SetStateAction } from 'react'
import { toast } from 'sonner'
import { getSubjectsWithQuestionsBySession, type Subject } from '@/entities/subject'
import type { ExamSession } from '@/entities/exam-session'
import type { ExamSessionFormData } from '../types'

interface DialogOpenersDeps {
  setSelectedSession: Dispatch<SetStateAction<ExamSession | null>>
  setFormData: Dispatch<SetStateAction<ExamSessionFormData>>
  setShowEditDialog: Dispatch<SetStateAction<boolean>>
  setShowDeleteDialog: Dispatch<SetStateAction<boolean>>
  setShowRescheduleDialog: Dispatch<SetStateAction<boolean>>
  setConfirmSessionName: Dispatch<SetStateAction<string>>
  setDuplicateName: Dispatch<SetStateAction<string>>
  setDuplicateSelectedSubjects: Dispatch<SetStateAction<string[]>>
  setDuplicateSourceSubjects: Dispatch<
    SetStateAction<Array<Subject & { questionCount: number }>>
  >
  setShowDuplicateDialog: Dispatch<SetStateAction<boolean>>
  setIsDuplicateLoading: Dispatch<SetStateAction<boolean>>
}

export function createDialogOpeners(deps: DialogOpenersDeps) {
  const {
    setSelectedSession,
    setFormData,
    setShowEditDialog,
    setShowDeleteDialog,
    setShowRescheduleDialog,
    setConfirmSessionName,
    setDuplicateName,
    setDuplicateSelectedSubjects,
    setDuplicateSourceSubjects,
    setShowDuplicateDialog,
    setIsDuplicateLoading,
  } = deps

  const openEditDialog = (session: ExamSession) => {
    setSelectedSession(session)
    setFormData({
      name: session.name,
      date: session.date.split('T')[0],
      time: session.time,
      duration: (session.duration || 60).toString(),
      hallCapacity: session.hallCapacity.toString(),
      totalQuestion: session.totalQuestion.toString(),
      compulsorySubjectId: session.compulsorySubjectId || '',
      totalCompulsoryQuestion: session.totalCompulsoryQuestion.toString(),
      totalOtherQuestions: session.totalOtherQuestions.toString(),
      centerId: session.centerId || '',
    })
    setShowEditDialog(true)
  }

  const openDeleteDialog = (session: ExamSession) => {
    setSelectedSession(session)
    setShowDeleteDialog(true)
  }

  const openRescheduleDialog = (session: ExamSession) => {
    setSelectedSession(session)
    setConfirmSessionName('')
    setShowRescheduleDialog(true)
  }

  const openDuplicateDialog = async (session: ExamSession) => {
    setSelectedSession(session)
    setDuplicateName(`Copy of ${session.name}`)
    setDuplicateSelectedSubjects([])
    setDuplicateSourceSubjects([])
    setShowDuplicateDialog(true)
    setIsDuplicateLoading(true)
    try {
      const subjectsWithQuestions = await getSubjectsWithQuestionsBySession(session.id)
      setDuplicateSourceSubjects(subjectsWithQuestions)
      setDuplicateSelectedSubjects(subjectsWithQuestions.map((s) => s.id))
    } catch {
      toast.error('Failed to load subjects for this session')
      setShowDuplicateDialog(false)
    } finally {
      setIsDuplicateLoading(false)
    }
  }

  const toggleDuplicateSubject = (subjectId: string) => {
    setDuplicateSelectedSubjects((prev) =>
      prev.includes(subjectId) ? prev.filter((id) => id !== subjectId) : [...prev, subjectId]
    )
  }

  return { openEditDialog, openDeleteDialog, openRescheduleDialog, openDuplicateDialog, toggleDuplicateSubject }
}
