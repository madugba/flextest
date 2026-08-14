import { useParams } from 'next/navigation'
import { useQuestionsDebugLog } from './effects/useQuestionsDebugLog'
import { useLoadAIModels } from './effects/useLoadAIModels'
import { useInitialLoad } from './effects/useInitialLoad'
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

  const aiModels = useLoadAIModels()

  useQuestionsDebugLog(questions)

  const loadData = createLoadData({
    subjectId,
    sessionId,
    setIsLoading,
    setError,
    setSubject,
    setSession,
    setQuestions,
  })

  useInitialLoad(subjectId, sessionId, loadData)

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
