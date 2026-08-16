'use client'

import { useState } from 'react'
import type { ExamSession, SessionStatus } from '@/entities/exam-session'
import type { Subject } from '@/entities/subject'
import type { APIConfiguration } from '@/entities/api-configuration'
import {
  useExamSessionsQuery,
  useCreateExamSessionMutation,
  useUpdateExamSessionMutation,
  useDeleteExamSessionMutation,
  useImportExamSessionsMutation,
  useRescheduleExamSessionMutation,
} from '@/entities/exam-session'
import { useCentersQuery } from '@/entities/center'
import { useSubjectsQuery } from '@/entities/subject'
import { useAPIConfigurationsQuery } from '@/entities/api-configuration'
import { filterExamSessions } from './selectors/filterExamSessions'
import { createUpdateFormField, createResetForm } from './handlers/createFormHandlers'
import { createCreateHandler } from './handlers/createCreateHandler'
import { createEditHandler } from './handlers/createEditHandler'
import { createDeleteHandler } from './handlers/createDeleteHandler'
import { createImportHandlers } from './handlers/createImportHandlers'
import { createDialogOpeners } from './handlers/createDialogOpeners'
import { createDuplicateHandler } from './handlers/createDuplicateHandler'
import { createRescheduleHandler } from './handlers/createRescheduleHandler'
import { EMPTY_EXAM_SESSION_FORM, type ExamSessionFormData } from './types'

export function useExamSessionsPage() {
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false)
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false)
  const [selectedSession, setSelectedSession] = useState<ExamSession | null>(null)
  const [confirmSessionName, setConfirmSessionName] = useState('')

  const [selectedConfigId, setSelectedConfigId] = useState('')
  const [selectedConfig, setSelectedConfig] = useState<APIConfiguration | null>(null)
  const [selectedClass, setSelectedClass] = useState('')

  const [formData, setFormData] = useState<ExamSessionFormData>(EMPTY_EXAM_SESSION_FORM)

  const [duplicateName, setDuplicateName] = useState('')
  const [duplicateSelectedSubjects, setDuplicateSelectedSubjects] = useState<string[]>([])
  const [duplicateSourceSubjects, setDuplicateSourceSubjects] = useState<
    Array<Subject & { questionCount: number }>
  >([])
  const [isDuplicateLoading, setIsDuplicateLoading] = useState(false)

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<SessionStatus | ''>('')

  const examSessionsQuery = useExamSessionsQuery(statusFilter || undefined)
  const centersQuery = useCentersQuery()
  const subjectsQuery = useSubjectsQuery()
  const apiConfigurationsQuery = useAPIConfigurationsQuery()

  const examSessions = examSessionsQuery.data ?? []
  const centers = centersQuery.data ?? []
  const subjects = subjectsQuery.data ?? []
  const apiConfigurations = apiConfigurationsQuery.data ?? []

  const createMutation = useCreateExamSessionMutation()
  const updateMutation = useUpdateExamSessionMutation()
  const deleteMutation = useDeleteExamSessionMutation()
  const importMutation = useImportExamSessionsMutation()
  const rescheduleMutation = useRescheduleExamSessionMutation()

  const loading =
    examSessionsQuery.isLoading ||
    centersQuery.isLoading ||
    subjectsQuery.isLoading ||
    apiConfigurationsQuery.isLoading

  const isSubmitting =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending ||
    importMutation.isPending ||
    rescheduleMutation.isPending

  const updateFormField = createUpdateFormField(setFormData)
  const resetForm = createResetForm(setFormData)

  const handleCreate = createCreateHandler({
    formData,
    createMutation,
    setShowCreateDialog,
    resetForm,
  })

  const handleEdit = createEditHandler({
    selectedSession,
    formData,
    updateMutation,
    setShowEditDialog,
    setSelectedSession,
    resetForm,
  })

  const handleDelete = createDeleteHandler({
    selectedSession,
    deleteMutation,
    setShowDeleteDialog,
    setSelectedSession,
  })

  const { loadAPIConfig, resetImportForm, handleImportFromApi } = createImportHandlers({
    apiConfigurations,
    selectedConfig,
    selectedClass,
    importMutation,
    setSelectedConfigId,
    setSelectedConfig,
    setSelectedClass,
    setShowImportDialog,
  })

  const { openEditDialog, openDeleteDialog, openRescheduleDialog, openDuplicateDialog, toggleDuplicateSubject } =
    createDialogOpeners({
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
    })

  const handleDuplicate = createDuplicateHandler({
    selectedSession,
    duplicateName,
    duplicateSelectedSubjects,
    createMutation,
    setShowDuplicateDialog,
    setSelectedSession,
    setDuplicateName,
    setDuplicateSelectedSubjects,
    setDuplicateSourceSubjects,
  })

  const handleReschedule = createRescheduleHandler({
    selectedSession,
    confirmSessionName,
    rescheduleMutation,
    setShowRescheduleDialog,
    setSelectedSession,
    setConfirmSessionName,
  })

  const filteredSessions = filterExamSessions(examSessions, search)

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
