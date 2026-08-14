'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import {
  getAllExamSessions,
  createExamSession,
  updateExamSession,
  deleteExamSession,
  importExamSessionsFromApi,
  rescheduleExamSession,
  type ExamSession,
  type SessionStatus,
} from '@/entities/exam-session'
import { getAllCenters, type Center } from '@/entities/center'
import {
  getAllSubjects,
  getSubjectsWithQuestionsBySession,
  type Subject,
} from '@/entities/subject'
import {
  getQuestionsBySubjectAndSession,
  bulkImportQuestions,
  type CreateQuestionRequest,
} from '@/entities/question'
import {
  getAllAPIConfigurations,
  type APIConfiguration,
} from '@/entities/api-configuration'
import { EMPTY_EXAM_SESSION_FORM, type ExamSessionFormData } from './types'

export function useExamSessionsPage() {
  const [examSessions, setExamSessions] = useState<ExamSession[]>([])
  const [centers, setCenters] = useState<Center[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [apiConfigurations, setApiConfigurations] = useState<APIConfiguration[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<SessionStatus | ''>('')
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false)
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false)
  const [duplicateName, setDuplicateName] = useState('')
  const [duplicateSelectedSubjects, setDuplicateSelectedSubjects] = useState<string[]>([])
  const [duplicateSourceSubjects, setDuplicateSourceSubjects] = useState<Array<Subject & { questionCount: number }>>([])
  const [isDuplicateLoading, setIsDuplicateLoading] = useState(false)
  const [selectedSession, setSelectedSession] = useState<ExamSession | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [confirmSessionName, setConfirmSessionName] = useState('')

  const [selectedConfigId, setSelectedConfigId] = useState('')
  const [selectedConfig, setSelectedConfig] = useState<APIConfiguration | null>(null)
  const [selectedClass, setSelectedClass] = useState('')

  const [formData, setFormData] = useState<ExamSessionFormData>(EMPTY_EXAM_SESSION_FORM)

  const fetchExamSessions = useCallback(async () => {
    try {
      setLoading(true)
      const data = await getAllExamSessions(statusFilter || undefined)
      setExamSessions(data)
    } catch (error) {
      toast.error('Failed to load exam sessions', {
        description: error instanceof Error ? error.message : 'An error occurred',
      })
    } finally {
      setLoading(false)
    }
  }, [statusFilter])

  const fetchCenters = useCallback(async () => {
    try {
      const data = await getAllCenters()
      setCenters(data)
    } catch {
      toast.error('Failed to load centers')
    }
  }, [])

  const fetchSubjects = useCallback(async () => {
    try {
      const data = await getAllSubjects()
      setSubjects(data)
    } catch {
      toast.error('Failed to load subjects')
    }
  }, [])

  const fetchAPIConfigurations = useCallback(async () => {
    try {
      const data = await getAllAPIConfigurations()
      setApiConfigurations(data)
    } catch (error) {
      toast.error('Failed to load API configurations', {
        description: error instanceof Error ? error.message : 'An error occurred',
      })
    }
  }, [])

  useEffect(() => {
    void fetchExamSessions()
  }, [fetchExamSessions])

  useEffect(() => {
    void fetchCenters()
    void fetchSubjects()
    void fetchAPIConfigurations()
  }, [fetchCenters, fetchSubjects, fetchAPIConfigurations])

  const updateFormField = useCallback((field: keyof ExamSessionFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }, [])

  const resetForm = useCallback(() => {
    setFormData(EMPTY_EXAM_SESSION_FORM)
  }, [])

  const handleCreate = useCallback(async () => {
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
      setIsSubmitting(true)
      await createExamSession({
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
      await fetchExamSessions()
    } catch (error) {
      toast.error('Failed to create exam session', {
        description: error instanceof Error ? error.message : 'An error occurred',
      })
    } finally {
      setIsSubmitting(false)
    }
  }, [formData, fetchExamSessions, resetForm])

  const handleEdit = useCallback(async () => {
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
        totalCompulsoryQuestion: formData.totalCompulsoryQuestion ? parseInt(formData.totalCompulsoryQuestion) : undefined,
        totalOtherQuestions: formData.totalOtherQuestions ? parseInt(formData.totalOtherQuestions) : undefined,
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
  }, [selectedSession, formData, fetchExamSessions, resetForm])

  const handleDelete = useCallback(async () => {
    if (!selectedSession) return

    try {
      setIsSubmitting(true)
      await deleteExamSession(selectedSession.id)
      toast.success('Exam session deleted successfully')
      setShowDeleteDialog(false)
      setSelectedSession(null)
      await fetchExamSessions()
    } catch (error) {
      toast.error('Failed to delete exam session', {
        description: error instanceof Error ? error.message : 'An error occurred',
      })
    } finally {
      setIsSubmitting(false)
    }
  }, [selectedSession, fetchExamSessions])

  const loadAPIConfig = useCallback((configId: string) => {
    const config = apiConfigurations.find((c) => c.id === configId)
    if (config) {
      setSelectedConfig(config)
      setSelectedClass('')
    } else {
      setSelectedConfig(null)
      setSelectedClass('')
    }
  }, [apiConfigurations])

  const resetImportForm = useCallback(() => {
    setSelectedConfigId('')
    setSelectedConfig(null)
    setSelectedClass('')
  }, [])

  const handleImportFromApi = useCallback(async () => {
    if (!selectedConfig) {
      toast.error('Please select an API configuration')
      return
    }

    if (selectedConfig.isSchoolPortal && !selectedClass) {
      toast.error('Please select a class for school portal import')
      return
    }

    try {
      setIsSubmitting(true)
      const result = await importExamSessionsFromApi(selectedConfig.apiEndpoint)
      toast.success('Import completed', {
        description: `Created: ${result.created}, Skipped: ${result.skipped}${result.errors.length > 0 ? `, Errors: ${result.errors.length}` : ''}`,
      })
      setShowImportDialog(false)
      resetImportForm()
      await fetchExamSessions()
    } catch (error) {
      toast.error('Failed to import exam sessions from API', {
        description: error instanceof Error ? error.message : 'An error occurred',
      })
    } finally {
      setIsSubmitting(false)
    }
  }, [selectedConfig, selectedClass, fetchExamSessions, resetImportForm])

  const openEditDialog = useCallback((session: ExamSession) => {
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
  }, [])

  const openDeleteDialog = useCallback((session: ExamSession) => {
    setSelectedSession(session)
    setShowDeleteDialog(true)
  }, [])

  const openRescheduleDialog = useCallback((session: ExamSession) => {
    setSelectedSession(session)
    setConfirmSessionName('')
    setShowRescheduleDialog(true)
  }, [])

  const openDuplicateDialog = useCallback(async (session: ExamSession) => {
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
  }, [])

  const toggleDuplicateSubject = useCallback((subjectId: string) => {
    setDuplicateSelectedSubjects((prev) =>
      prev.includes(subjectId) ? prev.filter((id) => id !== subjectId) : [...prev, subjectId],
    )
  }, [])

  const handleDuplicate = useCallback(async () => {
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

      // Fetch questions for each selected subject and collect them
      const allQuestions: CreateQuestionRequest[] = []
      for (const subjectId of duplicateSelectedSubjects) {
        const questions = await getQuestionsBySubjectAndSession(subjectId, selectedSession.id)
        for (const q of questions) {
          allQuestions.push({
            question: q.question,
            optionA: q.optionA,
            optionB: q.optionB,
            optionC: q.optionC,
            optionD: q.optionD,
            answer: q.answer,
            subjectId: q.subjectId,
            sessionId: newSession.id,
          })
        }
      }

      // Bulk import all collected questions into the new session
      if (allQuestions.length > 0) {
        await bulkImportQuestions({ questions: allQuestions })
      }

      toast.success('Exam session duplicated successfully', {
        description: `"${newSession.name}" created with ${allQuestions.length} question${allQuestions.length !== 1 ? 's' : ''}`,
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
  }, [selectedSession, duplicateName, duplicateSelectedSubjects, fetchExamSessions])

  const handleReschedule = useCallback(async () => {
    if (!selectedSession) return

    // Validate confirmation
    if (confirmSessionName !== selectedSession.name) {
      toast.error('Session name does not match')
      return
    }

    try {
      setIsSubmitting(true)
      await rescheduleExamSession(selectedSession.id)
      toast.success('Exam session rescheduled successfully', {
        description: 'All candidate progress and answers have been cleared',
      })
      setShowRescheduleDialog(false)
      setSelectedSession(null)
      setConfirmSessionName('')
      await fetchExamSessions()
    } catch (error) {
      toast.error('Failed to reschedule exam session', {
        description: error instanceof Error ? error.message : 'An error occurred',
      })
    } finally {
      setIsSubmitting(false)
    }
  }, [selectedSession, confirmSessionName, fetchExamSessions])

  const filteredSessions = useMemo(
    () =>
      examSessions.filter((session) =>
        session.name.toLowerCase().includes(search.toLowerCase())
      ),
    [examSessions, search]
  )

  return {
    examSessions,
    filteredSessions,
    centers,
    subjects,
    apiConfigurations,
    loading,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    showCreateDialog,
    setShowCreateDialog,
    showEditDialog,
    setShowEditDialog,
    showDeleteDialog,
    setShowDeleteDialog,
    showImportDialog,
    setShowImportDialog,
    showRescheduleDialog,
    setShowRescheduleDialog,
    showDuplicateDialog,
    setShowDuplicateDialog,
    formData,
    updateFormField,
    resetForm,
    selectedSession,
    setSelectedSession,
    isSubmitting,
    confirmSessionName,
    setConfirmSessionName,
    selectedConfigId,
    setSelectedConfigId,
    selectedConfig,
    selectedClass,
    setSelectedClass,
    loadAPIConfig,
    resetImportForm,
    duplicateName,
    setDuplicateName,
    duplicateSelectedSubjects,
    setDuplicateSelectedSubjects,
    duplicateSourceSubjects,
    isDuplicateLoading,
    openEditDialog,
    openDeleteDialog,
    openRescheduleDialog,
    openDuplicateDialog,
    toggleDuplicateSubject,
    handleCreate,
    handleEdit,
    handleDelete,
    handleImportFromApi,
    handleDuplicate,
    handleReschedule,
  }
}
