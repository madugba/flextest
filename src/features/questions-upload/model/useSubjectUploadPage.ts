'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'
import { getAllAIModels, type AIModelConfiguration } from '@/entities/ai-model'
import { createLoadData } from './handlers/createLoadData'
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
import { useQuestionDataState } from './state/useQuestionDataState'
import { useQuestionFormState } from './state/useQuestionFormState'
import { useQuestionSelectionState } from './state/useQuestionSelectionState'
import { useQuestionImportState } from './state/useQuestionImportState'
import { useQuestionAiState } from './state/useQuestionAiState'

export function useSubjectUploadPage() {
  const params = useParams()

  const sessionId = (params?.sessionId as string) || ''
  const subjectId = (params?.subjectId as string) || ''

  const {
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
  } = useQuestionDataState()

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

  const { selectedIds, setSelectedIds, isBulkDeleting, setIsBulkDeleting, bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen } =
    useQuestionSelectionState()

  const {
    importDialogOpen,
    setImportDialogOpen,
    setImportFile,
    parsedRows,
    setParsedRows,
    isImporting,
    setIsImporting,
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
    setIsSubmittingGenerated,
  } = useQuestionAiState()

  const [aiModels, setAiModels] = useState<AIModelConfiguration[]>([])

  useEffect(() => {
    const loadAIModels = async () => {
      try {
        const models = await getAllAIModels()
        setAiModels(models.filter((m) => m.isActive))
      } catch (error) {
        console.error('Failed to load AI models:', error)
        toast.error('Failed to load AI models')
      }
    }
    void loadAIModels()
  }, [])

  useEffect(() => {
    console.log('[questions state] Updated:', {
      count: questions.length,
      items: questions,
    })
  }, [questions])

  const loadData = createLoadData({
    subjectId,
    sessionId,
    setIsLoading,
    setError,
    setSubject,
    setSession,
    setQuestions,
  })

  useEffect(() => {
    if (subjectId && sessionId) {
      void loadData()
    }
  }, [subjectId, sessionId, loadData])

  const resetForm = createResetForm({
    setFormData,
    setEditingQuestion,
    setEditDialogOpen,
    setError,
  })

  const handleSubmit = createHandleSubmit({
    formData,
    editingQuestion,
    subjectId,
    sessionId,
    setIsSaving,
    setError,
    setQuestions,
    setEditDialogOpen,
    setActiveTab,
    resetForm,
    loadData,
  })

  const handleEdit = createHandleEdit({
    setEditingQuestion,
    setFormData,
    setError,
    setEditDialogOpen,
  })

  const handleDelete = createHandleDelete({
    questionToDelete,
    questions,
    setIsSaving,
    setError,
    setQuestions,
    setSelectedIds,
    setDeleteDialogOpen,
    setQuestionToDelete,
  })

  const handleBulkDelete = createHandleBulkDelete({
    selectedIds,
    setIsBulkDeleting,
    setQuestions,
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
    setIsImporting,
    setImportDialogOpen,
    setImportFile,
    setParsedRows,
    loadData,
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
    setIsSubmittingGenerated,
    setGeneratedQuestions,
    setPreviewDialogOpen,
    setAiGenerateDialogOpen,
    loadData,
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
