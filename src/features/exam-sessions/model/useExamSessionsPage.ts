'use client'

import { useState } from 'react'
import type { ExamSession } from '@/entities/exam-session'
import type { Subject } from '@/entities/subject'
import type { APIConfiguration } from '@/entities/api-configuration'
import { useExamSessionsData } from './state/useExamSessionsData'
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
  const {
    examSessions,
    centers,
    subjects,
    apiConfigurations,
    loading,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    fetchExamSessions,
  } = useExamSessionsData()

  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false)
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false)
  const [selectedSession, setSelectedSession] = useState<ExamSession | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
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

  const updateFormField = createUpdateFormField(setFormData)
  const resetForm = createResetForm(setFormData)

  const handleCreate = createCreateHandler({
    formData,
    setIsSubmitting,
    setShowCreateDialog,
    resetForm,
    fetchExamSessions,
  })

  const handleEdit = createEditHandler({
    selectedSession,
    formData,
    setIsSubmitting,
    setShowEditDialog,
    setSelectedSession,
    resetForm,
    fetchExamSessions,
  })

  const handleDelete = createDeleteHandler({
    selectedSession,
    setIsSubmitting,
    setShowDeleteDialog,
    setSelectedSession,
    fetchExamSessions,
  })

  const { loadAPIConfig, resetImportForm, handleImportFromApi } = createImportHandlers({
    apiConfigurations,
    selectedConfig,
    selectedClass,
    setSelectedConfigId,
    setSelectedConfig,
    setSelectedClass,
    setIsSubmitting,
    setShowImportDialog,
    fetchExamSessions,
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
    setIsSubmitting,
    setShowDuplicateDialog,
    setSelectedSession,
    setDuplicateName,
    setDuplicateSelectedSubjects,
    setDuplicateSourceSubjects,
    fetchExamSessions,
  })

  const handleReschedule = createRescheduleHandler({
    selectedSession,
    confirmSessionName,
    setIsSubmitting,
    setShowRescheduleDialog,
    setSelectedSession,
    setConfirmSessionName,
    fetchExamSessions,
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
