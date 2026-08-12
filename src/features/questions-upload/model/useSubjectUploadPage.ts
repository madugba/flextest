import { useState } from 'react'
import { useParams } from 'next/navigation'
import type { Question } from '@/entities/question'
import type { ExamSession } from '@/entities/exam-session'
import type { Subject } from '@/entities/subject'
import type { GeneratedQuestion } from '@/shared/services/ai-generation.service'
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
import type { AiGenerateFormData, ParsedRow, QuestionFormData } from './types'

export function useSubjectUploadPage() {
  const params = useParams()

  const sessionId = (params?.sessionId as string) || ''
  const subjectId = (params?.subjectId as string) || ''

  const [subject, setSubject] = useState<Subject | null>(null)
  const [session, setSession] = useState<ExamSession | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState<QuestionFormData>({
    question: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    answer: '',
  })

  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [questionToDelete, setQuestionToDelete] = useState<Question | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('single')

  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [isBulkDeleting, setIsBulkDeleting] = useState(false)
  const [bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen] = useState(false)
  const [importDialogOpen, setImportDialogOpen] = useState(false)
  const [, setImportFile] = useState<File | null>(null)
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([])
  const [isImporting, setIsImporting] = useState(false)

  const [aiGenerateDialogOpen, setAiGenerateDialogOpen] = useState(false)
  const aiModels = useLoadAIModels()
  const [aiGenerateFormData, setAiGenerateFormData] = useState<AiGenerateFormData>({
    modelId: '',
    numQuestions: 5,
    difficultyLevel: 'medium',
    extraPrompt: '',
  })
  const [isGenerating, setIsGenerating] = useState(false)

  const [previewDialogOpen, setPreviewDialogOpen] = useState(false)
  const [generatedQuestions, setGeneratedQuestions] = useState<GeneratedQuestion[]>([])
  const [isSubmittingGenerated, setIsSubmittingGenerated] = useState(false)

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
