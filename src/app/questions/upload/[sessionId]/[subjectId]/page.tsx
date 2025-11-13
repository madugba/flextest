'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import * as XLSX from 'xlsx'
import { DashboardHeader } from '@/widgets/dashboard/ui/DashboardHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/Card'
import { Button } from '@/shared/ui/Button'
import { Label } from '@/shared/ui/label'
import { Input } from '@/shared/ui/Input'
import { Alert } from '@/shared/ui/Alert'
import { Badge } from '@/shared/ui/Badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import { Textarea } from '@/shared/ui/textarea'
import { RichTextEditor } from '@/shared/ui/RichTextEditor'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'
import { getSubjectById, type Subject } from '@/entities/subject'
import { getExamSessionById, type ExamSession } from '@/entities/exam-session'
import {
  getQuestionsBySubjectAndSession,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  bulkImportQuestions,
  type Question,
  type AnswerOption,
} from '@/entities/question'
import {
  getAllAIModels,
  type AIModelConfiguration,
} from '@/entities/ai-model'
import {
  generateQuestions,
  type GeneratedQuestion,
} from '@/shared/services/ai-generation.service'
import {
  Plus,
  FileText,
  Edit2,
  Trash2,
  Save,
  X,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Search,
  Upload,
  Sparkles,
  Download,
  Loader2,
  CheckCircle,
  ArrowLeft,
} from 'lucide-react'

export default function SubjectUploadPage() {
  const params = useParams()
  const router = useRouter()

  const sessionId = params.sessionId as string
  const subjectId = params.subjectId as string

  const [subject, setSubject] = useState<Subject | null>(null)
  const [session, setSession] = useState<ExamSession | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    question: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    answer: '' as AnswerOption | '',
  })

  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [questionToDelete, setQuestionToDelete] = useState<Question | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('single')

  const [importDialogOpen, setImportDialogOpen] = useState(false)
  const [importFile, setImportFile] = useState<File | null>(null)
  const [parsedQuestions, setParsedQuestions] = useState<Omit<Question, 'id' | 'subjectId' | 'sessionId' | 'createdAt' | 'updatedAt'>[]>([])
  const [isImporting, setIsImporting] = useState(false)

  const [aiGenerateDialogOpen, setAiGenerateDialogOpen] = useState(false)
  const [aiModels, setAiModels] = useState<AIModelConfiguration[]>([])
  const [aiGenerateFormData, setAiGenerateFormData] = useState({
    modelId: '',
    numQuestions: 5,
    difficultyLevel: 'medium' as 'easy' | 'medium' | 'hard',
    extraPrompt: ''
  })
  const [isGenerating, setIsGenerating] = useState(false)

  const [previewDialogOpen, setPreviewDialogOpen] = useState(false)
  const [generatedQuestions, setGeneratedQuestions] = useState<GeneratedQuestion[]>([])
  const [isSubmittingGenerated, setIsSubmittingGenerated] = useState(false)

  const currentQuestionCount = questions.length

  useEffect(() => {
    console.log('[questions state] Updated:', {
      count: questions.length,
      items: questions
    })
  }, [questions])

  useEffect(() => {
    const loadAIModels = async () => {
      try {
        const models = await getAllAIModels()
        setAiModels(models.filter(m => m.isActive))
      } catch (error) {
        console.error('Failed to load AI models:', error)
        toast.error('Failed to load AI models')
      }
    }
    loadAIModels()
  }, [])

  const loadData = useCallback(async (bypassCache: boolean = false) => {
    try {
      setIsLoading(true)
      setError(null)

      console.log('[loadData] Starting to load data...', { subjectId, sessionId, bypassCache })

      if (bypassCache) {
        console.log('[loadData] Waiting for cache invalidation...')
        const cacheInvalidationDelayMs = 1_500
        await new Promise(resolve => setTimeout(resolve, cacheInvalidationDelayMs))
      }

      const [subjectData, sessionData, questionsData] = await Promise.all([
        getSubjectById(subjectId),
        getExamSessionById(sessionId),
        getQuestionsBySubjectAndSession(subjectId, sessionId, bypassCache),
      ])

      console.log('[loadData] Data loaded:', {
        subject: subjectData,
        session: sessionData,
        questions: questionsData,
        questionsIsArray: Array.isArray(questionsData),
        questionsLength: Array.isArray(questionsData) ? questionsData.length : 'N/A'
      })

      setSubject(subjectData)
      setSession(sessionData)

      if (Array.isArray(questionsData)) {
        console.log('[loadData] Setting questions:', questionsData.length, 'items')
        setQuestions(questionsData)

        if (bypassCache && questionsData.length === 0) {
          console.warn('[loadData] Got empty array after cache bypass, retrying in 2 seconds...')
          setTimeout(async () => {
            try {
              console.log('[loadData] Retry attempt...')
              const retryData = await getQuestionsBySubjectAndSession(subjectId, sessionId, true)
              console.log('[loadData] Retry result:', retryData.length, 'questions')
              if (Array.isArray(retryData) && retryData.length > 0) {
                setQuestions(retryData)
                console.log('[loadData] Successfully loaded questions on retry')
              }
            } catch (err) {
              console.error('[loadData] Retry failed:', err)
            }
          }, 2000)
        }
      } else {
        console.warn('[loadData] Questions data is not an array:', questionsData)
        setQuestions([])
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load data'
      setError(errorMessage)
      toast.error(errorMessage)
      console.error('[loadData] Error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [subjectId, sessionId])

  useEffect(() => {
    if (subjectId && sessionId) {
      loadData()
    }
  }, [subjectId, sessionId, loadData])

  const resetForm = () => {
    console.log('[resetForm] Resetting form and clearing edit state')
    setFormData({
      question: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      answer: '',
    })
    setEditingQuestion(null)
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.question.trim()) {
      toast.error('Please enter the question')
      return
    }

    if (!formData.optionA.trim() || !formData.optionB.trim() ||
        !formData.optionC.trim() || !formData.optionD.trim()) {
      toast.error('Please fill in all options')
      return
    }

    if (!formData.answer) {
      toast.error('Please select the correct answer')
      return
    }

    try {
      setIsSaving(true)
      setError(null)

      if (editingQuestion) {
        console.log('[handleSubmit] Updating question:', editingQuestion.id)
        await updateQuestion(editingQuestion.id, {
          question: formData.question,
          optionA: formData.optionA,
          optionB: formData.optionB,
          optionC: formData.optionC,
          optionD: formData.optionD,
          answer: formData.answer,
          subjectId,
          sessionId,
        })
        console.log('[handleSubmit] Question updated successfully')
        toast.success('Question updated successfully!')
      } else {
        console.log('[handleSubmit] Creating new question')
        const createdQuestion = await createQuestion({
          question: formData.question,
          optionA: formData.optionA,
          optionB: formData.optionB,
          optionC: formData.optionC,
          optionD: formData.optionD,
          answer: formData.answer as AnswerOption,
          subjectId,
          sessionId,
        })
        console.log('[handleSubmit] Question created:', createdQuestion)
        toast.success('Question created successfully!')
      }

      resetForm()
      await loadData(true)
      setActiveTab('list')

      console.log('[handleSubmit] Success!')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : undefined;
      const responseMessage = (typeof err === 'object' && err !== null && 'response' in err)
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
        : undefined;
      const errorMessage = message || responseMessage || 'Failed to save question';
      toast.error(errorMessage)
      setError(errorMessage)
      console.error('Question save error:', err)
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = (question: Question) => {
    console.log('[handleEdit] Editing question:', question.id)
    setEditingQuestion(question)
    setFormData({
      question: question.question,
      optionA: question.optionA,
      optionB: question.optionB,
      optionC: question.optionC,
      optionD: question.optionD,
      answer: question.answer,
    })

    setTimeout(() => {
      const formElement = document.getElementById('question-form')
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 100)
    setTimeout(() => {
      const editorElement = document.querySelector('[data-editor="question"]') as HTMLElement | null
      if (editorElement) {
        editorElement.focus()
      }
    }, 200)

    console.log('[handleEdit] Form populated with question data')
  }

  const handleDelete = async () => {
    if (!questionToDelete) {
      console.log('[handleDelete] No question to delete')
      return
    }

    try {
      setIsSaving(true)
      setError(null)

      console.log('[handleDelete] Starting delete for question:', questionToDelete.id)
      console.log('[handleDelete] Current questions count:', questions.length)
      console.log('[handleDelete] Questions IDs:', questions.map(q => q.id))

      await deleteQuestion(questionToDelete.id)
      console.log('[handleDelete] Delete API call completed successfully')

      toast.success('Question deleted successfully!')

      setTimeout(() => {
        loadData(true)
      }, 1500)

      setDeleteDialogOpen(false)
      setQuestionToDelete(null)
    } catch (err: unknown) {
      console.error('[handleDelete] Error occurred:', err)
      const errObj = typeof err === 'object' && err !== null ? err : {};
      console.error('[handleDelete] Error type:', errObj.constructor?.name)
      console.error('[handleDelete] Error message:', err instanceof Error ? err.message : undefined)
      console.error('[handleDelete] Error statusCode:', 'statusCode' in errObj ? (errObj as { statusCode?: unknown }).statusCode : undefined)
      console.error('[handleDelete] Error code:', 'code' in errObj ? (errObj as { code?: unknown }).code : undefined)

      const message = err instanceof Error ? err.message : undefined;
      const responseMessage = 'response' in errObj
        ? (errObj as { response?: { data?: { message?: string } } }).response?.data?.message
        : undefined;
      const errorMessage = message || responseMessage || 'Failed to delete question';
      toast.error(errorMessage)
      setError(errorMessage)
    } finally {
      setIsSaving(false)
    }
  }

  const downloadSampleExcel = () => {
    const sampleData = [
      {
        question: 'What is 2 + 2?',
        optionA: '3',
        optionB: '4',
        optionC: '5',
        optionD: '6',
        answer: 'B'
      },
      {
        question: 'What is the capital of France?',
        optionA: 'London',
        optionB: 'Berlin',
        optionC: 'Paris',
        optionD: 'Madrid',
        answer: 'C'
      },
      {
        question: 'Which planet is known as the Red Planet?',
        optionA: 'Venus',
        optionB: 'Mars',
        optionC: 'Jupiter',
        optionD: 'Saturn',
        answer: 'B'
      }
    ]

    const worksheet = XLSX.utils.json_to_sheet(sampleData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Questions')
    XLSX.writeFile(workbook, 'questions_sample.xlsx')
    toast.success('Sample file downloaded!')
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setImportFile(file)

    try {
      const data = await file.arrayBuffer()
      const workbook = XLSX.read(data)
      const worksheet = workbook.Sheets[workbook.SheetNames[0]]
      const jsonData = XLSX.utils.sheet_to_json(worksheet)

      console.log('[handleFileSelect] Parsed data:', jsonData)

      const transformedQuestions = (jsonData as Record<string, unknown>[]).map((row, index) => {
        if (!row.question || !row.optionA || !row.optionB || !row.optionC || !row.optionD || !row.answer) {
          throw new Error(`Row ${index + 2} is missing required fields`)
        }

        if (!['A', 'B', 'C', 'D'].includes(String(row.answer).toUpperCase())) {
          throw new Error(`Row ${index + 2} has invalid answer (must be A, B, C, or D)`)
        }

        return {
          question: row.question.toString(),
          optionA: row.optionA.toString(),
          optionB: row.optionB.toString(),
          optionC: row.optionC.toString(),
          optionD: row.optionD.toString(),
          answer: String(row.answer).toUpperCase() as AnswerOption
        }
      })

      setParsedQuestions(transformedQuestions)
      toast.success(`Parsed ${transformedQuestions.length} questions successfully!`)
    } catch (err: unknown) {
      console.error('[handleFileSelect] Error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to parse Excel file';
      toast.error(errorMessage)
      setImportFile(null)
      setParsedQuestions([])
    }
  }

  const handleImport = async () => {
    if (parsedQuestions.length === 0) {
      toast.error('No questions to import')
      return
    }

    try {
      setIsImporting(true)

      const enrichedQuestions = parsedQuestions.map((question) => ({
        ...question,
        subjectId,
        sessionId,
      }))

      console.log('[handleImport] Importing questions:', enrichedQuestions)

      const result = await bulkImportQuestions({
        questions: enrichedQuestions
      })

      console.log('[handleImport] Import result:', result)

      toast.success(`Successfully imported ${result.success} out of ${result.total} questions!`)

      setImportDialogOpen(false)
      setImportFile(null)
      setParsedQuestions([])

      await loadData(true)
    } catch (err: unknown) {
      console.error('[handleImport] Error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to import questions';
      toast.error(errorMessage)
    } finally {
      setIsImporting(false)
    }
  }

  const handleGenerateQuestions = async () => {
    if (!aiGenerateFormData.modelId || !subject) {
      toast.error('Please select an AI model')
      return
    }

    const selectedModel = aiModels.find(m => m.id === aiGenerateFormData.modelId)
    if (!selectedModel) {
      toast.error('Selected model not found')
      return
    }

    try {
      setIsGenerating(true)
      toast.info('Generating questions with AI...')

      const questions = await generateQuestions({
        model: selectedModel,
        subjectName: subject.name,
        difficultyLevel: aiGenerateFormData.difficultyLevel,
        additionalInstructions: aiGenerateFormData.extraPrompt,
        numQuestions: aiGenerateFormData.numQuestions,
      })

      setGeneratedQuestions(questions)
      setPreviewDialogOpen(true)
      toast.success(`Generated ${questions.length} questions!`)
    } catch (err: unknown) {
      console.error('[handleGenerate] Error:', err)
      toast.error((err as Error).message || 'Failed to generate questions')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSubmitGenerated = async () => {
    if (generatedQuestions.length === 0) {
      toast.error('No questions to submit')
      return
    }

    try {
      setIsSubmittingGenerated(true)

      const formattedQuestions = generatedQuestions.map((question) => ({
        question: question.question,
        optionA: question.optionA,
        optionB: question.optionB,
        optionC: question.optionC,
        optionD: question.optionD,
        answer: question.answer,
        subjectId,
        sessionId
      }))

      const result = await bulkImportQuestions({
        questions: formattedQuestions
      })

      toast.success(`Successfully added ${result.success} out of ${result.total} questions!`)

      setGeneratedQuestions([])
      setPreviewDialogOpen(false)
      setAiGenerateDialogOpen(false)
      await loadData(true)
    } catch (err: unknown) {
      console.error('[handleSubmitGenerated] Error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit questions';
      toast.error(errorMessage)
    } finally {
      setIsSubmittingGenerated(false)
    }
  }

  const requiredQuestions =
    session && subject && session.compulsorySubjectId === subject.id
      ? session.totalCompulsoryQuestion
      : session?.totalOtherQuestions || 0
  const uploadedCount = questions.length
  const remainingCount = Math.max(0, requiredQuestions - uploadedCount)

  const filteredQuestions = questions.filter(question =>
    question.question.toLowerCase().includes(searchQuery.toLowerCase())
  )
  const progressPercentage = session
    ? Math.min(
        Math.round((questions.length / session.totalQuestion) * 100),
        100
      )
    : 0

  if (isLoading) {
    return (
      <div className="flex-1 overflow-auto">
        <DashboardHeader />
        <div className="p-6">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-500">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-auto">
      <DashboardHeader />

      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Button
              onClick={() => router.back()}
              variant="outline"
              size="sm"
              className="shrink-0"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
            <div className="flex gap-2">
              <Button
                onClick={() => setImportDialogOpen(true)}
                variant="outline"
                size="sm"
                className="shrink-0"
              >
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
              <Button
                onClick={() => setAiGenerateDialogOpen(true)}
                variant="outline"
                size="sm"
                className="shrink-0"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Generate with AI
              </Button>
              <Button
                onClick={() => loadData(true)}
                variant="outline"
                size="sm"
                disabled={isLoading}
                className="shrink-0"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{subject?.name}</h1>
            <p className="text-gray-500 mt-1">
              {session?.name} • {session && new Date(session.date).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Stats Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Uploaded</p>
              <p className="text-3xl font-bold text-blue-600">{uploadedCount}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Required</p>
              <p className="text-3xl font-bold text-gray-900">{requiredQuestions}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Remaining</p>
              <p
                className={`text-3xl font-bold ${
                  remainingCount === 0 ? 'text-green-600' : 'text-orange-600'
                }`}
              >
                {remainingCount}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Progress</p>
              <div className="flex items-center gap-2">
                <p className="text-3xl font-bold text-gray-900">{progressPercentage.toFixed(0)}%</p>
                {progressPercentage === 100 && <CheckCircle2 className="h-7 w-7 text-green-600" />}
              </div>
            </div>
          </div>

          <div className="relative w-full bg-gray-100 rounded-full h-3 overflow-hidden">
            <div
              className={`h-3 transition-all duration-500 ${
                progressPercentage === 100 ? 'bg-green-500' : 'bg-blue-500'
              }`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            {error}
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="single">
              <Plus className="h-4 w-4 mr-2" />
              Add Question
            </TabsTrigger>
            <TabsTrigger value="list">
              <FileText className="h-4 w-4 mr-2" />
              All Questions ({uploadedCount})
            </TabsTrigger>
          </TabsList>

          {/* Single Question Form */}
          <TabsContent value="single">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <CardTitle>
                    {editingQuestion ? 'Edit Question' : 'Add New Question'}
                  </CardTitle>
                  {editingQuestion && (
                    <Badge variant="default" className="bg-blue-600">
                      Editing
                    </Badge>
                  )}
                </div>
                <CardDescription>
                  {editingQuestion
                    ? 'Update the question details below.'
                    : 'Enter question and options. Supports HTML and mathematical formulas.'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Question */}
                  <div className="space-y-2">
                    <Label htmlFor="question">Question *</Label>
                    <RichTextEditor
                      value={formData.question}
                      onChange={(value) =>
                        setFormData({ ...formData, question: value })
                      }
                      placeholder="Enter question text (supports formatting and mathematical formulas)"
                      minHeight="200px"
                    />
                  </div>

                  {/* Options */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {['A', 'B', 'C', 'D'].map((option) => (
                      <div key={option} className="space-y-2">
                        <Label htmlFor={`option${option}`}>Option {option} *</Label>
                        <RichTextEditor
                          value={formData[`option${option}` as keyof typeof formData] as string}
                          onChange={(value) =>
                            setFormData({ ...formData, [`option${option}`]: value })
                          }
                          placeholder={`Enter option ${option}`}
                          minHeight="120px"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Correct Answer */}
                  <div className="space-y-2">
                    <Label htmlFor="answer">Correct Answer *</Label>
                    <Select
                      value={formData.answer}
                      onValueChange={(value) =>
                        setFormData({ ...formData, answer: value as AnswerOption })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select correct answer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A">Option A</SelectItem>
                        <SelectItem value="B">Option B</SelectItem>
                        <SelectItem value="C">Option C</SelectItem>
                        <SelectItem value="D">Option D</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3">
                    <Button type="submit" disabled={isSaving}>
                      <Save className="h-4 w-4 mr-2" />
                      {editingQuestion ? 'Update Question' : 'Save Question'}
                    </Button>
                    {editingQuestion && (
                      <Button type="button" variant="outline" onClick={resetForm}>
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Question List */}
          <TabsContent value="list">
            <Card>
              <CardHeader>
                <CardTitle>Uploaded Questions</CardTitle>
                <CardDescription>
                  Manage questions uploaded for this subject
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Search Bar */}
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search questions, options..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-10"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  {searchQuery && (
                    <p className="text-sm text-gray-500 mt-2">
                      Found {filteredQuestions.length} of {questions.length} questions
                    </p>
                  )}
                </div>

                {questions.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No questions uploaded yet</p>
                    <p className="text-gray-400 text-sm mt-2">Start by adding your first question</p>
                  </div>
                ) : filteredQuestions.length === 0 ? (
                  <div className="text-center py-12">
                    <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No questions match your search</p>
                    <p className="text-gray-400 text-sm mt-2">Try a different search term</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredQuestions.map((question) => {
                      const originalIndex = questions.findIndex(q => q.id === question.id)
                      return (
                        <Card key={question.id} className="border-2">
                          <CardContent className="pt-6">
                            <div className="space-y-4">
                              {/* Question Number and Actions */}
                              <div className="flex items-start justify-between">
                                <Badge variant="outline" className="text-base px-3 py-1">
                                  Question {originalIndex + 1}
                                </Badge>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEdit(question)}
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => {
                                    setQuestionToDelete(question)
                                    setDeleteDialogOpen(true)
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>

                            {/* Question Text */}
                            <div>
                              <p className="font-semibold text-gray-700 mb-2">Question:</p>
                              <div
                                className="text-gray-900 bg-gray-50 p-3 rounded"
                                dangerouslySetInnerHTML={{ __html: question.question }}
                              />
                            </div>

                            {/* Options */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {['A', 'B', 'C', 'D'].map((option) => {
                                const optionKey = `option${option}` as keyof Question
                                const isCorrect = question.answer === option

                                return (
                                  <div
                                    key={option}
                                    className={`p-3 rounded border-2 ${
                                      isCorrect
                                        ? 'border-green-500 bg-green-50'
                                        : 'border-gray-200 bg-gray-50'
                                    }`}
                                  >
                                    <div className="flex items-start gap-2">
                                      <Badge
                                        variant={isCorrect ? 'default' : 'outline'}
                                        className="shrink-0"
                                      >
                                        {option}
                                      </Badge>
                                      <div
                                        className="flex-1 text-sm"
                                        dangerouslySetInnerHTML={{
                                          __html: question[optionKey] as string,
                                        }}
                                      />
                                      {isCorrect && (
                                        <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                                      )}
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Import Dialog */}
        <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Import Questions from Excel</DialogTitle>
              <DialogDescription>
                Upload an Excel file with questions. Download the sample file to see the expected format.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Download Sample Button */}
              <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div>
                  <p className="font-medium text-gray-900">Need a template?</p>
                  <p className="text-sm text-gray-600">Download our sample Excel file to get started</p>
                </div>
                <Button onClick={downloadSampleExcel} variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download Sample
                </Button>
              </div>

              {/* File Upload */}
              <div>
                <Label htmlFor="excel-file">Select Excel File</Label>
                <Input
                  id="excel-file"
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileSelect}
                  className="mt-2"
                />
                {importFile && (
                  <p className="text-sm text-gray-600 mt-2">
                    Selected: {importFile.name}
                  </p>
                )}
              </div>

              {/* Preview */}
              {parsedQuestions.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">
                    Preview ({parsedQuestions.length} questions)
                  </h3>
                  <div className="max-h-96 overflow-y-auto space-y-3 border rounded-lg p-4 bg-gray-50">
                    {parsedQuestions.slice(0, 5).map((q, index) => (
                      <Card key={index} className="border-2">
                        <CardContent className="pt-4">
                          <div className="space-y-2">
                            <p className="font-medium text-gray-900">
                              {index + 1}. {q.question}
                            </p>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <p className={q.answer === 'A' ? 'text-green-600 font-semibold' : 'text-gray-600'}>
                                A: {q.optionA}
                              </p>
                              <p className={q.answer === 'B' ? 'text-green-600 font-semibold' : 'text-gray-600'}>
                                B: {q.optionB}
                              </p>
                              <p className={q.answer === 'C' ? 'text-green-600 font-semibold' : 'text-gray-600'}>
                                C: {q.optionC}
                              </p>
                              <p className={q.answer === 'D' ? 'text-green-600 font-semibold' : 'text-gray-600'}>
                                D: {q.optionD}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {parsedQuestions.length > 5 && (
                      <p className="text-sm text-gray-500 text-center py-2">
                        ... and {parsedQuestions.length - 5} more questions
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setImportDialogOpen(false)
                  setImportFile(null)
                  setParsedQuestions([])
                }}
                disabled={isImporting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleImport}
                disabled={parsedQuestions.length === 0 || isImporting}
              >
                {isImporting ? 'Importing...' : `Import ${parsedQuestions.length} Questions`}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Question</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this question? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete} disabled={isSaving}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Preview Dialog for Generated Questions */}
        <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">Review Generated Questions</DialogTitle>
              <DialogDescription>
                Review the AI-generated questions before adding them to your question bank
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              <Alert className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
                <CheckCircle className="h-4 w-4 text-blue-600" />
                <div className="ml-2">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    {generatedQuestions.length} questions generated successfully
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                    Please review each question carefully before submitting to ensure quality and accuracy
                  </p>
                </div>
              </Alert>

              {/* Questions List */}
              <div className="space-y-6">
                {generatedQuestions.map((q, index) => (
                  <Card key={index} className="p-4">
                    <div className="space-y-3">
                      {/* Question Number and Text */}
                      <div>
                        <div className="flex items-start gap-3">
                          <Badge variant="outline" className="shrink-0">
                            Q{index + 1}
                          </Badge>
                          <div
                            className="flex-1 text-sm leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: q.question }}
                          />
                        </div>
                      </div>

                      {/* Options */}
                      <div className="grid grid-cols-1 gap-2 ml-11">
                        {['A', 'B', 'C', 'D'].map((option) => {
                          const optionKey = `option${option}` as keyof typeof q
                          const isCorrect = q.answer === option
                          return (
                            <div
                              key={option}
                              className={`flex items-start gap-2 p-3 rounded-lg border ${
                                isCorrect
                                  ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800'
                                  : 'bg-gray-50 dark:bg-gray-900/30 border-gray-200 dark:border-gray-800'
                              }`}
                            >
                              <span className="shrink-0 font-medium text-sm min-w-[20px]">
                                {option}.
                              </span>
                              <span
                                className="text-sm"
                                dangerouslySetInnerHTML={{ __html: q[optionKey] as string }}
                              />
                              {isCorrect && (
                                <CheckCircle2 className="h-4 w-4 text-green-600 ml-auto shrink-0" />
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="outline"
                onClick={() => setPreviewDialogOpen(false)}
                disabled={isSubmittingGenerated}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitGenerated}
                disabled={isSubmittingGenerated}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmittingGenerated ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Add {generatedQuestions.length} Questions
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* AI Generation Dialog */}
        <Dialog open={aiGenerateDialogOpen} onOpenChange={setAiGenerateDialogOpen}>
          <DialogContent className="sm:max-w-[580px]">
            <DialogHeader className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <DialogTitle className="text-xl">Generate Questions with AI</DialogTitle>
                  <DialogDescription className="text-sm">
                    Configure AI settings to automatically generate questions
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Current Status */}
              <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 p-4 border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                      Current Question Bank
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                      {currentQuestionCount} question{currentQuestionCount !== 1 ? 's' : ''} currently uploaded for{' '}
                      <span className="font-medium">{subject?.name}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Model Selection */}
              <div className="space-y-2">
                <Label htmlFor="ai-model" className="text-sm font-medium">
                  AI Model <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={aiGenerateFormData.modelId}
                  onValueChange={(value) =>
                    setAiGenerateFormData({ ...aiGenerateFormData, modelId: value })
                  }
                >
                  <SelectTrigger id="ai-model" className="w-full">
                    <SelectValue placeholder="Select an AI model..." />
                  </SelectTrigger>
                  <SelectContent>
                    {aiModels.length === 0 ? (
                      <SelectItem value="none" disabled>
                        No AI models configured
                      </SelectItem>
                    ) : (
                      aiModels.map((model) => (
                        <SelectItem key={model.id} value={model.id}>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{model.provider}</span>
                            {model.modelName && (
                              <span className="text-gray-500">- {model.modelName}</span>
                            )}
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {aiModels.length === 0 && (
                  <p className="text-xs text-gray-500">
                    Configure AI models in settings to enable generation
                  </p>
                )}
              </div>

              {/* Number of Questions and Difficulty in a grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Number of Questions */}
                <div className="space-y-2">
                  <Label htmlFor="num-questions" className="text-sm font-medium">
                    Number of Questions
                  </Label>
                  <Input
                    id="num-questions"
                    type="number"
                    min="1"
                    max="20"
                    value={aiGenerateFormData.numQuestions}
                    onChange={(e) =>
                      setAiGenerateFormData({
                        ...aiGenerateFormData,
                        numQuestions: Math.min(20, Math.max(1, parseInt(e.target.value) || 1)),
                      })
                    }
                    className="w-full"
                  />
                </div>

                {/* Difficulty Level */}
                <div className="space-y-2">
                  <Label htmlFor="difficulty" className="text-sm font-medium">
                    Difficulty Level
                  </Label>
                  <Select
                    value={aiGenerateFormData.difficultyLevel}
                    onValueChange={(value: 'easy' | 'medium' | 'hard') =>
                      setAiGenerateFormData({ ...aiGenerateFormData, difficultyLevel: value })
                    }
                  >
                    <SelectTrigger id="difficulty" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-green-500" />
                          Easy
                        </div>
                      </SelectItem>
                      <SelectItem value="medium">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-yellow-500" />
                          Medium
                        </div>
                      </SelectItem>
                      <SelectItem value="hard">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-red-500" />
                          Hard
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Extra Prompt */}
              <div className="space-y-2">
                <Label htmlFor="extra-prompt" className="text-sm font-medium">
                  Additional Instructions <span className="text-gray-400">(Optional)</span>
                </Label>
                <Textarea
                  id="extra-prompt"
                  placeholder="e.g., Focus on specific topics, include diagrams, add real-world examples..."
                  value={aiGenerateFormData.extraPrompt}
                  onChange={(e) =>
                    setAiGenerateFormData({ ...aiGenerateFormData, extraPrompt: e.target.value })
                  }
                  rows={4}
                  className="resize-none"
                />
                <p className="text-xs text-gray-500">
                  Provide specific guidance to customize the generated questions
                </p>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="outline"
                onClick={() => {
                  setAiGenerateDialogOpen(false)
                  setAiGenerateFormData({
                    modelId: '',
                    numQuestions: 5,
                    difficultyLevel: 'medium',
                    extraPrompt: ''
                  })
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleGenerateQuestions}
                disabled={!aiGenerateFormData.modelId || isGenerating}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate {aiGenerateFormData.numQuestions} Question{aiGenerateFormData.numQuestions !== 1 ? 's' : ''}
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
