'use client'

import { useCallback } from 'react'
import { useParams } from 'next/navigation'
import {
  useAIModelsQuery,
} from '@/entities/ai-model'
import { useSubjectQuery } from '@/entities/subject'
import { useExamSessionQuery } from '@/entities/exam-session'
import {
  useQuestionsBySubjectAndSessionQuery,
  useCreateQuestionMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
  useBulkImportQuestionsMutation,
} from '@/entities/question'
import { createResetForm } from './handlers/createResetForm'
import { createHandleSubmit } from './handlers/createHandleSubmit'
import { createHandleEdit } from './handlers/createHandleEdit'
import { createHandleDelete } from './handlers/createHandleDelete'
import { createHandleBulkDelete } from './handlers/createHandleBulkDelete'
import { downloadSampleExcel } from './handlers/downloadSampleExcel'
import { createHandleFileSelect } from './handlers/createHandleFileSelect'
import { createHandleImport } from './handlers/createHandleImport'
import { createHandleGenerateQuestions } from './handlers/createHandleGenerateQuestions'
import { createHandleSubmitGenerated } from './handlers/createHandleSubmitGenerated'
import { getRequiredQuestionCount } from './selectors/getRequiredQuestionCount'
import { getProgressPercentage } from './selectors/getProgressPercentage'
import { filterQuestionsByQuery } from './selectors/filterQuestionsByQuery'
import { useQuestionFormState } from './state/useQuestionFormState'
import { useQuestionSelectionState } from './state/useQuestionSelectionState'
import { useQuestionImportState } from './state/useQuestionImportState'
import { useQuestionAiState } from './state/useQuestionAiState'

export function useSubjectUploadPage() {
  const params = useParams()

  const sessionId = (params?.sessionId as string) || ''
  const subjectId = (params?.subjectId as string) || ''

  const subjectQuery = useSubjectQuery(subjectId || undefined)
  const sessionQuery = useExamSessionQuery(sessionId || undefined)
  const questionsQuery = useQuestionsBySubjectAndSessionQuery(subjectId || undefined, sessionId || undefined)
  const aiModelsQuery = useAIModelsQuery()

  const subject = subjectQuery.data ?? null
  const session = sessionQuery.data ?? null
  const questions = questionsQuery.data ?? []

  const createMutation = useCreateQuestionMutation()
  const updateMutation = useUpdateQuestionMutation()
  const deleteMutation = useDeleteQuestionMutation()
  const importMutation = useBulkImportQuestionsMutation()

  const {
    formData,
    setFormData,
    editingQuestion,
    setEditingQuestion,
    deleteDialogOpen,
    setDeleteDialogOpen,
    questionToDelete,
    setQuestionToDelete,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    editDialogOpen,
    setEditDialogOpen,
  } = useQuestionFormState()

  const { selectedIds, setSelectedIds, isBulkDeleting, bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen } =
    useQuestionSelectionState()

  const {
    importDialogOpen,
    setImportDialogOpen,
    setImportFile,
    parsedRows,
    setParsedRows,
    isImporting,
  } = useQuestionImportState()

  const {
    aiGenerateDialogOpen,
    setAiGenerateDialogOpen,
    aiGenerateFormData,
    setAiGenerateFormData,
    isGenerating,
    setIsGenerating,
    previewDialogOpen,
    setPreviewDialogOpen,
    generatedQuestions,
    setGeneratedQuestions,
    isSubmittingGenerated,
  } = useQuestionAiState()

  const aiModels = (aiModelsQuery.data ?? []).filter((m) => m.isActive)

  const isLoading =
    subjectQuery.isLoading || sessionQuery.isLoading || questionsQuery.isLoading

  const isSaving =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending ||
    importMutation.isPending

  const error =
    subjectQuery.error?.message ??
    sessionQuery.error?.message ??
    questionsQuery.error?.message ??
    null

  const loadData = useCallback(async () => {
    await Promise.all([
      subjectQuery.refetch(),
      sessionQuery.refetch(),
      questionsQuery.refetch(),
    ])
  }, [subjectQuery, sessionQuery, questionsQuery])

  const resetForm = createResetForm({
    setFormData,
    setEditingQuestion,
    setEditDialogOpen,
  })

  const handleSubmit = createHandleSubmit({
    formData,
    editingQuestion,
    subjectId,
    sessionId,
    createMutation,
    updateMutation,
    setEditDialogOpen,
    setActiveTab,
    resetForm,
  })

  const handleEdit = createHandleEdit({
    setEditingQuestion,
    setFormData,
    setEditDialogOpen,
  })

  const handleDelete = createHandleDelete({
    questionToDelete,
    deleteMutation,
    setSelectedIds,
    setDeleteDialogOpen,
    setQuestionToDelete,
  })

  const handleBulkDelete = createHandleBulkDelete({
    selectedIds,
    deleteMutation,
    setSelectedIds,
    setBulkDeleteConfirmOpen,
  })

  const handleFileSelect = createHandleFileSelect({
    setImportFile,
    setParsedRows,
  })

  const handleImport = createHandleImport({
    parsedRows,
    subjectId,
    sessionId,
    importMutation,
    setImportDialogOpen,
    setImportFile,
    setParsedRows,
  })

  const handleGenerateQuestions = createHandleGenerateQuestions({
    aiGenerateFormData,
    subject,
    aiModels,
    setIsGenerating,
    setGeneratedQuestions,
    setPreviewDialogOpen,
  })

  const handleSubmitGenerated = createHandleSubmitGenerated({
    generatedQuestions,
    subjectId,
    sessionId,
    importMutation,
    setGeneratedQuestions,
    setPreviewDialogOpen,
    setAiGenerateDialogOpen,
  })

  const requiredQuestions = getRequiredQuestionCount(session, subject)
  const uploadedCount = questions.length
  const remainingCount = Math.max(0, requiredQuestions - uploadedCount)
  const filteredQuestions = filterQuestionsByQuery(questions, searchQuery)
  const progressPercentage = getProgressPercentage(session, questions.length)
  const currentQuestionCount = questions.length

  return {
    sessionId,
    subject,
    session,
    questions,
    isLoading,
    isSaving,
    error,
    formData,
    setFormData,
    deleteDialogOpen,
    setDeleteDialogOpen,
    setQuestionToDelete,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    editDialogOpen,
    setEditDialogOpen,
    selectedIds,
    setSelectedIds,
    isBulkDeleting,
    bulkDeleteConfirmOpen,
    setBulkDeleteConfirmOpen,
    importDialogOpen,
    setImportDialogOpen,
    setImportFile,
    parsedRows,
    setParsedRows,
    isImporting,
    aiGenerateDialogOpen,
    setAiGenerateDialogOpen,
    aiModels,
    aiGenerateFormData,
    setAiGenerateFormData,
    isGenerating,
    previewDialogOpen,
    setPreviewDialogOpen,
    generatedQuestions,
    isSubmittingGenerated,
    currentQuestionCount,
    requiredQuestions,
    uploadedCount,
    remainingCount,
    progressPercentage,
    filteredQuestions,
    resetForm,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleBulkDelete,
    downloadSampleExcel,
    handleFileSelect,
    handleImport,
    handleGenerateQuestions,
    handleSubmitGenerated,
    loadData,
  }
}
